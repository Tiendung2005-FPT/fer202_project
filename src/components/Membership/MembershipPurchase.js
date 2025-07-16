import React, { useEffect, useState } from "react";
import "./MembershipPurchase.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MembershipPurchase() {
    const [memberships, setMemberships] = useState(null);
    const [isVip, setIsVip] = useState(false);
    const user = JSON.parse(localStorage.getItem("userAccount"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.vipExpiry) {
            const expiryDate = new Date(user.vipExpiry).getTime();
            const now = new Date();
            setIsVip(now <= expiryDate);
        } else {
            setIsVip(false);
        }

        axios.get("http://localhost:9999/membershipPlans")
            .then(result => setMemberships(result.data))
            .catch(err => console.error(err));
    }, []);

    const benefits = [
        "Trợ lý viết truyện AI nâng cao hơn",
        "Thêm nhiều công cụ chỉnh sửa như màu sắc, phông chữ,...",
        "Truyện sẽ xuất hiện ở khu vực VIP riêng",
    ];

    const formatDate = (date) => {
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    if (!isVip) {
        return (
            <div className="membership-container">
                <h2 className="membership-title">Mua Gói Thành Viên VIP</h2>

                <div className="membership-plans">
                    {memberships?.map((membership) => {
                        const today = new Date();
                        const expiry = new Date();
                        expiry.setDate(today.getDate() + membership.durationDays);

                        return (
                            <div key={membership.id} className="plan-card">
                                <h3>{membership.name}</h3>
                                <p><strong>Giá:</strong> {membership.price}₫</p>
                                <p>
                                    <strong>Hiệu lực:</strong> từ {formatDate(today)} đến {formatDate(expiry)}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <h3 className="section-title">Quyền Lợi Khi Là Thành Viên</h3>
                <ul className="benefits-list">
                    {benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                    ))}
                </ul>

                <h3 className="section-title">Cách Thanh Toán</h3>
                <div className="payment-section">
                    <p>Chuyển khoản số tiền tương ứng đến tài khoản sau:</p>
                    <img
                        src="/bank-qr.jpg"
                        alt="QR chuyển khoản"
                        className="qr-image"
                    />
                    <p><strong>Ngân hàng:</strong> MB Bank</p>
                    <p><strong>Chủ tài khoản:</strong> NGUYEN TIEN DUNG</p>
                    <p><strong>Nội dung chuyển khoản:</strong> MUA VIP - [tên người dùng]</p>
                    <p>
                        Sau khi chuyển khoản, vui lòng gửi hình ảnh hóa đơn qua Zalo của Admin theo số điện thoại 0767676770 để được kích hoạt gói VIP.
                    </p>
                </div>
            </div>
        );
    }
    else {
    const expiryDate = new Date(user.vipExpiry);
    const now = new Date();
    const remainingDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    return (
        <div className="membership-container">
            <h2 className="membership-title">Bạn đã là thành viên VIP!</h2>
            <div className="vip-info-card">
                <p><strong>Hiệu lực VIP đến:</strong> {formatDate(expiryDate)}</p>
                <p><strong>Còn lại:</strong> {remainingDays} ngày</p>
            </div>

            <h3 className="section-title">Quyền Lợi Khi Là Thành Viên</h3>
            <ul className="benefits-list">
                {benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                ))}
            </ul>
        </div>
    );
}
}
