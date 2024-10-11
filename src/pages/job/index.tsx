import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row } from 'antd';
import styles from 'styles/client.module.scss';
import JobCard from '@/components/client/card/job.card';
import { useEffect, useState } from 'react';
// interface ISearch {
//     searchTemp: {
//         location: string[],
//         skills: string[]
//     }

// }
const ClientJobPage = (props: any) => {
    const [searchTemp, setSearchTemp] = useState<{ location: string[]; skills: string[] }>({
        location: [],
        skills: []
    });
    console.log(searchTemp)
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <SearchClient searchTemp={searchTemp} setSearchTemp={setSearchTemp} />
                </Col>
                <Divider />

                <Col span={24}>
                    <JobCard
                        searchTemp={searchTemp}
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientJobPage;