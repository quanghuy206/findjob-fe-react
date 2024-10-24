import ArticleCard from '@/components/client/card/article.card'
import { Col, Row } from 'antd'
import styles from 'styles/client.module.scss';

const ArticleClientPage = () => {
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <ArticleCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ArticleClientPage