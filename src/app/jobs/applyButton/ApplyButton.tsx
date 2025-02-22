import React, { useEffect, useState } from 'react';
import ApplyJobModal from '../ApplyJobModal';
import { useTranslation } from 'react-i18next';
import style from '../ApplyJobModal.module.scss';
import useLoginAlert from '@hooks/useLoginAlert';
import useVerificationAlert from '@hooks/useVerificationAlert';
import { RootState, useAppSelector } from '../../../store/store';
import { CVProvider } from '../components/CVContext';

interface ApplyButtonProps {
  jobName: string;
  companyId: string;
  jobId: string;
  disabled?: boolean;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ jobName, companyId, jobId, disabled }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { isLoginRequired } = useLoginAlert();
  const { isVerificationRequired } = useVerificationAlert();
  const userLogin = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    setIsVerified(userLogin.userProfile?.isVerify);
  }, []);
  console.log(userLogin.userProfile);
  const handleOpenModal = () => {
    if (!isLoggedIn) {
      isLoginRequired();
      return;
    }
    if (!isVerified) {
      isVerificationRequired();
      return;
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <>
      <button onClick={handleOpenModal} disabled={disabled} className={style['apply-button']}>
        {t('btn.applyNow')}
      </button>
      {isModalVisible && (
        <CVProvider>
          <ApplyJobModal jobName={jobName} companyId={companyId} jobId={jobId} onClose={handleCloseModal} disabled={disabled} />
        </CVProvider>
      )}
    </>
  );
};

export default ApplyButton;
