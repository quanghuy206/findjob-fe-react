import { callFetchJob } from '@/config/api';
import { LOCATION_LIST, convertSlug, getLocationName } from '@/config/utils';
import { IJob } from '@/types/backend';
import { EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

interface IProps {
    searchTemp: {
        location: string[],
        skills: string[]
    }
    showPagination?: boolean;
}

const JobCard = (props: IProps) => {
    const { searchTemp, showPagination = false } = props;

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [location, setLocation] = useState<string[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    const params = searchTemp.location.map(item => `location=${encodeURIComponent(item)}`).join('&');
    useEffect(() => {
        fetchJob();
        if (searchTemp) {
            setLocation(searchTemp.location);
            setSkills(searchTemp.skills);
        }
    }, [current, pageSize, params, skills, sortQuery]);

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (params) {
            query += `&${params}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item._id}`)
    }

    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className={`${styles["job-content"]}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Công Việc Mới Nhất</span>
                                {!showPagination &&
                                    <Link to="job">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayJob?.map(item => {
                            return (
                                <Col span={24} md={12} key={item._id}>
                                    <Card size="small" title={null} hoverable
                                        onClick={() => handleViewDetailJob(item)}
                                    >
                                        <div className={styles["card-job-content"]}>
                                            <div className={styles["card-job-left"]}>
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${item?.company?.logo}`}
                                                />
                                            </div>
                                            <div className={styles["card-job-right"]}>
                                                <div className={styles["job-updatedAt"]}>{dayjs(item.updatedAt).fromNow()}</div>
                                                <div className={styles["job-title"]}>{item.name}</div>
                                                <div className={styles["job-location"]}><EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(item.location)}</div>
                                                <div><ThunderboltOutlined style={{ color: 'orange' }} />&nbsp;{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</div>
                                                <div className={styles["btn-customeze-jobs"]}>
                                                    {
                                                        item.skills.map(skill => (
                                                            <a href="#">{skill}</a>
                                                        ))
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                    </Card>
                                </Col>


                            )
                        })}


                        {(!displayJob || displayJob && displayJob.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default JobCard;