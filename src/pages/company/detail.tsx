import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany, IJob } from "@/types/backend";
import { callFetchCompanyById, callFetchJobByCompanyId } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Card, Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { convertSlug } from "@/config/utils";


const ClientCompanyDetailPage = (props: any) => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [totalJob, setTotalJob] = useState<number>()

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    console.log(companyDetail)
    useEffect(() => {
        const initCompany = async () => {
            if (id) {
                setIsLoading(true)
                try {
                    const companyRes = await callFetchCompanyById(id);
                    if (companyRes?.data) {
                        setCompanyDetail(companyRes.data)
                    }
                } catch (error) {
                    console.error("Error fetching company data", error);
                }
                finally {
                    setIsLoading(false);
                }
            }
        }
        const initJob = async () => {
            if (id) {
                setIsLoading(true)
                try {
                    const jobRes = await callFetchJobByCompanyId(id);
                    if (jobRes?.data) {
                        setDisplayJob(jobRes.data.result);
                        setTotalJob(jobRes.data.meta.total)
                    }
                } catch (error) {
                    console.error("Error fetching company data", error);
                }
                finally {
                    setIsLoading(false);
                }
            }
        }
        initCompany()
        initJob();
    }, [id]);

    console.log(companyDetail)
    return (
        <div className={styles["wrap-bg"]}>
            <Row gutter={[20, 20]}>
                {companyDetail && companyDetail._id &&
                    <Col span={24} md={16} style={{ marginBottom: 30 }}>
                        <div className={styles['wrapBg-company']}>
                            <div className={styles["companyInfo"]}>
                                <div className={styles.companyLogo}>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${companyDetail?.logo}`} alt="Company Logo" />
                                </div>
                                <div className={styles.companyDetails}>
                                    <h1>{companyDetail.name}</h1>
                                    <span>
                                        <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(companyDetail?.address)}
                                    </span>
                                    <a href="#" className={styles.jobOpenings}>{totalJob} Job Opening</a>
                                </div>
                            </div>

                        </div>
                    </Col>
                }
            </Row>
            <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
                {isLoading ?
                    <Skeleton />
                    :
                    <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col>
                            {parse(companyDetail?.description ?? "")}
                        </Col>
                        {
                            displayJob?.map(item => (
                                <Col span={8}>
                                    <div className={styles["card-jobs"]}>
                                        <h3>
                                            <Link to={`/job/${convertSlug(item.name)}?id=${item._id}`}>{item.name}</Link>
                                        </h3>
                                        <div className={styles["comp-job"]}>
                                            <Link to={`/company/${convertSlug(item.company.name)}?id=${item.company._id}`} className="img-job" style={{ marginRight: 10 }}>
                                                <img style={{ width: 48, height: 48 }}
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${companyDetail?.logo}`}
                                                    alt="" />
                                            </Link>
                                            <span>
                                                <a href="#">{item.company?.name}</a>
                                            </span>
                                        </div>
                                        <div>
                                            Location: {item.location}
                                        </div>
                                        <div className={styles["btn-customeze-jobs"]}>
                                            {
                                                item.skills.map(skill => (
                                                    <a href="#">{skill}</a>
                                                ))
                                            }

                                        </div>
                                    </div>

                                </Col>

                            ))
                        }


                    </Row>

                }
            </div>
        </div>

    )
}
export default ClientCompanyDetailPage;