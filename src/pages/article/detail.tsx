import { callFetchArticle, callFetchArticleById } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { IArticles } from '@/types/backend';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { divide } from 'lodash';
const ClientArticleDetailPage = () => {

    const [articleDetail, setArticleDetail] = useState<IArticles | null>(null)
    const [displayArticle, setDisplayArticle] = useState<IArticles[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const navigate = useNavigate();

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    useEffect(() => {
        const initArticle = async () => {
            if (id) {
                setIsLoading(true)
                try {
                    const res = await callFetchArticleById(id);
                    if (res?.data) {
                        setArticleDetail(res.data)
                    }
                } catch (error) {
                    console.error("Error Fetch Detail Article", error)
                }
                finally {
                    setIsLoading(false)
                }
            }
        }
        initArticle()
    }, [id])

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


    const filterGetArtiles = displayArticle?.filter(item => item._id !== id)
    return (
        <div className={styles["wrap-article-detail"]}>
            <div className={`${styles["container"]} ${styles["detail-art-section"]}`}>
                {isLoading ?
                    <Skeleton />
                    :
                    <Row gutter={[20, 20]}>
                        {articleDetail && articleDetail._id &&
                            <>
                                <Col span={24} md={16} className={styles["main-art"]}>
                                    <div className={styles["info-detail-art"]}>
                                        <h1>{articleDetail.title}</h1>
                                        <p>{articleDetail.createdAt}</p>
                                        <p>{articleDetail.updatedAt}</p>
                                    </div>
                                    {parse(articleDetail?.content)}
                                </Col>


                            </>

                        }

                        <Col span={24} md={8} className={styles["side-art"]}>
                            {filterGetArtiles?.map(item => {
                                console.log(item._id)
                                return (
                                    <div className={styles["detai-side-art"]} onClick={() => handleViewDetailArticle(item)}>
                                        <div>
                                            <img
                                                alt="example"
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/articles/${item?.logo}`}
                                            />
                                        </div>
                                        <div className={styles["intro-side-art"]}>
                                            <h4>{item.title}</h4>
                                        </div>

                                    </div>
                                )
                            })}

                            <Divider />
                        </Col>
                    </Row>
                }


            </div>
        </div>


    )
}

export default ClientArticleDetailPage