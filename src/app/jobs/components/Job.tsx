import React, { useState } from 'react';
import style from '../jobs.module.scss';
import { Job as JobType } from '../../jobs/model';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { HistoryOutlined, UnorderedListOutlined } from '@ant-design/icons';
import FavoriteButton from '../components/FavoriteButton';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { Skills } from '@icon/icon';
import ApplyButton from '../applyButton/ApplyButton';

interface JobProps {
  job: JobType;
  isJobExpired: (endDate: string) => boolean;
  getRemainingDays: (endDate: string) => number;
}

const Job: React.FC<JobProps> = ({ job, isJobExpired, getRemainingDays }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showApplyPopup, setShowApplyPopup] = useState(false);

  const handleJobClick = () => {
    history.push(`/jobs/${job._id}`);
  };

  const handleApplyClick = () => {
    history.push({
      pathname: `/jobs/${job._id}`,
      state: { openApplyPopup: true },
    });
  };

  return (
    <div className={style.jobCard} onClick={handleJobClick}>
      <img src={`${process.env.REACT_APP_API_URL}/images/company/${job.company.logo}`} alt={`${job.company.name} logo`} className={style.logo} />
      <div className={style.jobDetails}>
        <div className={style.top}>
          <div className={style.jobTitle}>
            <Tooltip title={job.name}>{job.name}</Tooltip>
            <div className={style.companyName}>{job.company.name}</div>
            {/* <div className={style.skills}>{job.skills.join(', ')}</div> */}
            <div className={style.head}>
              <UnorderedListOutlined />
              <p>{job.skills.join(', ')}</p>
            </div>
            <div className={style.head}>
              <HistoryOutlined />
              <p>{dayjs(job.updatedAt).fromNow()}</p>
            </div>
          </div>
          <div className={style.salary}>{job.salary.toLocaleString()} VND</div>
        </div>
        <div className={style.bottom}>
          <div className={style.location}>{job.location}</div>
          <div className={style.timeRemaining}>
            <strong>{getRemainingDays(job.endDate)}</strong> {t('timeRemaining')}
          </div>
          <div className={style.groupBtnAct}>
            {/* <button className={`${style.btn} ${style.btnApply}`} disabled={isJobExpired(job.endDate)}>
              {t('jobDetail.applyNow')}
            </button> */}
            <ApplyButton jobName={job.name} companyId={job.company._id} jobId={job._id} disabled={isJobExpired(job.endDate)} />
            <FavoriteButton job={job} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;
