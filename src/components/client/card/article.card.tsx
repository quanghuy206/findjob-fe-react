import { callFetchArticle } from '@/config/api';
import { IArticles } from '@/types/backend';
import { Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import styles from 'styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { RightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { convertSlug } from '@/config/utils';

const ArticleCard = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayArticle, setDisplayArticle] = useState<IArticles[] | null>(null);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();
    useEffect(() => {
        fetchArticle();
    }, [current, pageSize, filter, sortQuery])

    const fetchArticle = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchArticle(query);
        if (res && res.data) {
            setDisplayArticle(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }
    const handleViewDetailArticle = (item: IArticles) => {
        if (item.title) {
            const slug = convertSlug(item.title);
            navigate(`/article/${slug}?id=${item._id}`)
        }
    }

    return (
        <div className={`${styles["article-section"]}`}>
            <div className={styles["article-content"]}>
                <Spin spinning={isLoading} tip="loading">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Features Article</span>
                            </div>
                        </Col>
                        <Col span={24} className={styles['wrap-article']}>
                            <Card>
                                {displayArticle?.map((article) => (
                                    <Card.Grid
                                        className={styles["grid-card"]}
                                        onClick={() => handleViewDetailArticle(article)}>
                                        <div className={styles["item-article"]}>
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/articles/${article.logo}`}
                                                alt={article.title}
                                                className={styles["side-image"]}
                                            />
                                            <h4 className={styles["side-title"]}>{article.title}</h4>
                                            <p className={styles["cus-summary"]}>
                                                {article.summary.length > 100 ? `${article.summary.slice(0, 100)}...` : article.summary}
                                            </p>
                                            <Link to="/" className={styles["side-link"]}>
                                                Start reading
                                                <span>
                                                    <RightOutlined />
                                                </span>
                                            </Link>
                                        </div>
                                    </Card.Grid>

                                ))}
                            </Card>

                        </Col>
                    </Row>
                </Spin>
            </div>
        </div>

    );
}

export default ArticleCard