import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AuthFormLayout } from '../shared/AuthFormLayout';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { ResetPasswordFormInputs } from '../forms';
import style from '../auth.module.scss';
import { CButton, CInput, CInputHint } from '../../../common/ui/base';
import { PASS_PATTERN } from '../../../common/utils/constants';
import { FormatPasswordRule } from '../register/FormatPasswordRule';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { resetPassword } from '../api';
import { PageURL } from '../../../models/enum';
import Success from '../../../common/ui/assets/images/Success.svg';
import { useAppDispatch } from '../../../store/store';
import { logoutThunk } from '../../../store/reducer/userSlice/userThunk';

interface Props extends RouteComponentProps {}

export const ResetPassword = (props: Props): ReactElement => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    getValues,
    register,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    reValidateMode: 'onChange',
  });
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const history = useHistory();
  const refPassword = useRef(null);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResetSuccessfully, setIsResetSuccessfully] = useState<boolean>(false);

  const validateCfmPass = (data: string): boolean => {
    return data === getValues('newPassword');
  };

  const handleFocusPasswordInput = () => {
    setIsPasswordFocused(true);
  };

  const handleBlurPasswordInput = () => {
    setIsPasswordFocused(false);
  };

  const redirectToLoginPage = () => {
    history.push(PageURL.LOGIN);
  };

  const dispatch = useAppDispatch();

  const checkShowPasswordRule = (): boolean => {
    const passwordValue = watch('newPassword');
    if (!passwordValue) return false;
    return isPasswordFocused || errors.newPassword?.type === 'pattern';
  };

  const onValid: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    const { newPassword } = data;
    if (!token) {
      console.error('Token is null or undefined');
      return;
    }

    const dataSubmit = { token, newPassword };
    setIsLoading(true);
    try {
      await resetPassword(dataSubmit);
      setIsResetSuccessfully(true);

      await dispatch(logoutThunk());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid: SubmitErrorHandler<ResetPasswordFormInputs> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  useEffect(() => {}, []);

  if (isResetSuccessfully) {
    return (
      <AuthFormLayout title='sucess.title' icon={Success}>
        <div className={style.resetSuccessful}>
          <p>{t('auth.createNewPassSuccess.first')}</p>
          <p>{t('auth.createNewPassSuccess.second')}</p>
          <CButton label={t('btn.backToLogin')} className={`${style.btn} mb-0`} onClick={redirectToLoginPage} />
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout title='auth.resetPass' otherError={errorMessage}>
      <Form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className={style.form}>
        <Form.Group className={style.inputGroup} ref={refPassword}>
          <Form.Label>{t('field.newPassword')}</Form.Label>
          <CInput
            autoComplete='off'
            type='password'
            name='newPassword'
            iref={register({
              required: 'field.error.required',
              pattern: PASS_PATTERN,
            })}
            onFocus={handleFocusPasswordInput}
            onBlur={handleBlurPasswordInput}
            placeholder={t('field.hint.newPassword')}
            valid={!errors.newPassword}
          />
          {errors.newPassword?.type === 'required' && <CInputHint>{t(`${errors.newPassword.message}`)}</CInputHint>}
        </Form.Group>
        <FormatPasswordRule value={watch('newPassword') || ''} target={refPassword} isFocus={checkShowPasswordRule()} />
        <Form.Group className={style.inputGroup}>
          <Form.Label>{t('field.newCfmPassword')}</Form.Label>
          <CInput
            id='confirm_password'
            autoComplete='off'
            type='password'
            name='confirm_password'
            iref={register({
              required: 'field.error.required',
              validate: (data) => validateCfmPass(data),
            })}
            placeholder={t('field.newCfmPassword')}
            valid={!errors.confirm_password}
            maxLength={32}
          />
          {errors.confirm_password?.type === 'required' && <CInputHint>{t(`${errors.confirm_password.message}`)}</CInputHint>}
          {errors.confirm_password?.type === 'validate' && <CInputHint>{t('field.error.confirm_password')}</CInputHint>}
        </Form.Group>
        <CButton type='submit' label={t('btn.save')} className={`${style.btn} mb-0`} loading={isLoading} disabled={isLoading} />
      </Form>
    </AuthFormLayout>
  );
};
