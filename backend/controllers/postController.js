const Post = require('../models/postModel')
const mq = require('./rabbitmq')


class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString }

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete (queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(regex)\b/g)
        this.query.find(JSON.parse(queryStr))

        return this
    }

    sorting() { }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

postController = {
    getPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Post.find(), req.query).filtering()
            const posts = await features.query
            // mq.publish('post', 'get_post',JSON.stringify(features))

            res.json(posts)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createPosts: async (req, res) => {
        const id = req.params.id;
        try {
            const { title, desc, photo, username, categories } = req.body;
            if (!photo) return res.status(400).json({ msg: "No image upload" })

            const posts = await Post.findById(id)
            if (posts)
                return res.status(400).json({ msg: "This post already exists." })


            const newPost = new Post({
                title, desc, photo, username, categories
            })
            mq.publish('post', 'created_post',JSON.stringify(newPost))
            await newPost.save()
            res.json({ msg: "Created a post" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deletePosts: async (req, res) => {
        try {
            const deletes = await Post.findByIdAndDelete(req.params.id)
            mq.publish('post', 'delete_post',JSON.stringify(deletes))

            res.json({ msg: 'Deleted a post' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updatePosts: async (req, res) => {
        try {
            const updatedPost = await Post.findByIdAndUpdate(
              req.params.id,
              {
                $set: req.body,
              },
              { new: true }
            );
            res.status(200).json(updatedPost);
          } catch (err) {
            res.status(500).json(err);
          }
    },
    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllPost: async (req, res) => {
        const username = req.query.user;
        const catName = req.query.cat;
        try {
            let posts;
            if (username) {
                posts = await Post.find({ username });
            } else if (catName) {
                posts = await Post.find({
                    categories: {
                        $in: [catName],
                      },
                });
            } else {
                posts = await Post.find();
            }
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = postController