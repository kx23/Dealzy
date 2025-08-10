import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    // ��������� ��� �������� ������ ����������
    const [ads, setAds] = useState([]);

    // useEffect ����� ������ ��� �������� ��������
    useEffect(() => {
        // ������� ��� �������� ������
        const fetchAds = async () => {
            try {
                const response = await fetch("http://localhost:5176/api/ads"); // ����� API
                if (!response.ok) {
                    throw new Error("������ �������� ������");
                }
                const data = await response.json();
                console.log("������ � API:", data); // ���������, ��� �������� � ����
                setAds(data);
            } catch (error) {
                console.error("������ ��� ��������� ����������:", error);
            }
        };

        fetchAds(); // �������� ������� ��� �������� ������
    }, []); // ������ ������ ��������, ��� useEffect ��������� ������ ��� ������ �������

    return (
        <div className="container">
            <h1 className="my-4">Latest Ads</h1>
            <div className="row">
                {ads.slice(0, 10).map((ad) => (
                    <div className="col-md-4" key={ad.id}>
                        <div className="card mb-4">
                            <img
                                src={ad.imageUrl}
                                alt={ad.title}
                                className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{ad.title}</h5>
                                <p className="card-text">{ad.description}</p>
                                <p className="card-text"><strong>Price: </strong>{ad.price} USD</p>
                                <a href="#" className="btn btn-primary">View Details</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
