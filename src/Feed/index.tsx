import React, {useCallback, useMemo, useReducer, useState} from "react";
import {v4} from "uuid";
import { isEqual } from "lodash";
import styles from "./index.module.css";

interface IPost {
    id: string;
    text: string;
    comments: IComment[];
}

interface ICommentFormProps {
    addComment: (text: string) => void,
}

const CommentForm = React.memo(({ addComment }: ICommentFormProps) => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleAddComment = () => {
        addComment(inputValue);
        setInputValue("");
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={handleChange}/>
            <button onClick={handleAddComment}>Add Comment</button>
        </div>
    );
});

interface IPostProps {
    addComment: (text: string, id: string) => void,
    comments: IComment[],
    children: React.ReactNode,
    id: string,
}

const Post = React.memo(({ addComment, comments, children, id }: IPostProps) => {
    const commentsElements = useMemo(() => comments.map(comment => (
        <Comment key={comment.id}>
            <span>{comment.text}</span>
        </Comment>
    )), [comments]);

    return (
        <div className={styles.post}>
            {children}
            <CommentForm addComment={(text) => addComment(text, id)} />
            {commentsElements}
        </div>
    );
}, (prevProps, nextProps) => isEqual(prevProps, nextProps));

interface IComment {
    id: string;
    text: string;
    post_id: string;
}

interface ICommentProps {
    children: React.ReactNode,
}

const Comment = React.memo(({ children }: ICommentProps) => {
    return (
        <div className={styles.comment}>
            {children}
        </div>
    );
}, (prevProps, nextProps) => isEqual(prevProps, nextProps));

interface IPostFormProps {
    addPost: (text: string) => void,
}

const PostForm = ({ addPost }: IPostFormProps) => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    }

    const handleAddPost = () => {
        addPost(inputValue);
    };

    return (
        <div className={styles.form}>
            <div><textarea value={inputValue} onChange={handleChange}/></div>
            <div>
                <button onClick={handleAddPost}>Add Post</button>
            </div>
        </div>
    );
};

type Action = { type: "ADD_POST", text: string } | { type: "ADD_COMMENT", text: string, post_id: string };

const postsReducer = (state: IPost[], action: Action): IPost[] => {
    switch (action.type) {
        case "ADD_POST": {
            return [...state, { id: v4(), text: action.text, comments: [] }]
        }

        case "ADD_COMMENT": {
            return state.map(
                post => post.id === action.post_id ?
                    { ...post, comments: [
                        ...post.comments, { id: v4(), text: action.text, post_id: action.post_id }
                        ]
                    } : post
            );
        }

        default: {
            return state;
        }
    }
};

const Feed = () => {
    const [posts, dispatch] = useReducer(postsReducer, []);

    const addPost = useCallback((text: string) => {
        dispatch({ type: "ADD_POST", text });
    }, []);

    const addComment = useCallback((text: string, post_id: string) => {
        dispatch({ type: "ADD_COMMENT", text, post_id });
    }, []);

    const postsElements = useMemo(() => posts.map(post => (
        <Post key={post.id} id={post.id} comments={post.comments} addComment={addComment}>
            <span>{post.text}</span>
        </Post>
    )), [addComment, posts]);

    return (
        <div className={styles.feed}>
            <PostForm addPost={addPost} />
            <div className={styles.postContainer}>
                {postsElements}
            </div>
        </div>
    );
};

export default Feed;