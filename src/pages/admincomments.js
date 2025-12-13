import React, { useEffect, useState } from "react";
import {
  getAllCommentsAdmin,
  updateCommentStatus,
  deleteComment,
} from "../API/Comment";

const AdminComment = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getAllCommentsAdmin();
      setComments(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải bình luận:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateCommentStatus(id, status);
      loadComments();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      await deleteComment(id);
      loadComments();
    } catch (error) {
      console.error("Lỗi xoá bình luận:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý bình luận</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người dùng</th>
              <th>Nội dung</th>
              <th>Sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.user?.fullname || "Không rõ"}</td>
                <td>{c.noidung}</td>
                <td>{c.sanpham?.tensp}</td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminComment;
