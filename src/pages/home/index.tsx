import { Button, Divider } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import ArticleCard from '@/components/client/card/article.card';

const HomePage = () => {
    const [searchTemp, setSearchTemp] = useState<{ location: string[]; skills: string[] }>({
        location: [],
        skills: []
    });
    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            {/* <div className="search-content" style={{ marginTop: 20 }}>
                <SearchClient />
            </div> */}
            <Divider />
            <CompanyCard />
            <div style={{ margin: 50 }}></div>
            <Divider />
            <JobCard
                searchTemp={searchTemp}
                showPagination={false} />
            <div className={styles['wrap-btn-jobs']}>
                <Link to="/job" className={styles['custom-link']}>View more jobs
                    <span><RightOutlined /></span>
                </Link>
            </div>
            <ArticleCard />
        </div>
    )
}

export default HomePage;