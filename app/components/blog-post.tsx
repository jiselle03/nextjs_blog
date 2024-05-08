type Props = {
  num: number
}

const BlogPost = ({ num }: Props) => {
  return (
    <div className="border border-gray-300 rounded p-4 mb-4">
      Blog post {num}
    </div>
  );
}

export default BlogPost;
