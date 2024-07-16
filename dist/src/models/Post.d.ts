import type { IPostModel } from "src/interfaces/entities/post";
declare const Post: import("mongoose").Model<IPostModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IPostModel> & IPostModel & Required<{
    _id: unknown;
}>, any>;
export default Post;
