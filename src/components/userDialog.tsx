import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useMutation} from '@apollo/client';
import {USER_INSERT, USER_UPDATE} from '../graphQl/mutation';

interface props {
    open: boolean,
    activeUser: { id: string, name: string, email: string }
    setOpen: Dispatch<SetStateAction<boolean>>,
    refetch: () => void
    setActiveUser: Dispatch<SetStateAction<{ id: string, name: string, email: string }>>
    handleSnackbarOpen: () => void
}

export const UserDialog = (props: props) => {
  const {open, setOpen, activeUser, refetch, setActiveUser, handleSnackbarOpen}=props;
  const [createUser] = useMutation(USER_INSERT);
  const [updateUser] = useMutation(USER_UPDATE);


    interface form {
        [key: string]: {
            value: string,
            error: string,
        }
    }

    const [formData, setFormData] = useState<form>({
      name: {
        value: '',
        error: '',
      },
      email: {
        value: '',
        error: '',
      },
      password: {
        value: '',
        error: '',
      },
      repeatPassword: {
        value: '',
        error: '',
      },
    });


    const handleClose = () => {
      setOpen(false);
      setActiveUser({id: '-1', name: '', email: ''});
    };

    useEffect(() => {
      if (activeUser.id !== '-1') {
        setFormData({
          ...formData,
          name: {...formData.name, value: activeUser.name},
          email: {...formData.email, value: activeUser.email},
        });
      } else {
        setFormData(
            {
              name: {
                value: '',
                error: '',
              },
              email: {
                value: '',
                error: '',
              },
              password: {
                value: '',
                error: '',
              },
              repeatPassword: {
                value: '',
                error: '',
              },
            },
        );
      }
    }, [activeUser]);

    const updateFormValue = ({value, field}: { value: string, field: string }) => {
      setFormData({...formData, [field]: {...formData[field], value: value}});
    };

    const updateFormError = ({value, field}: { value: string, field: string }) => {
      setFormData({...formData, [field]: {...formData[field], error: value}});
    };

    // eslint-disable-next-line max-len
    const lengthValidate = ({field, length, message}: { field: string, length: number, message: string }) => {
      if (formData[field].value) {
        if (formData[field]!.value!.length >= length) {
          updateFormError({value: '', field});
          return;
        }
      }
      updateFormError({value: message, field});
    };

    const nameValidate = () => {
      lengthValidate({
        field: 'name', length: 3, message: 'Слишком короткое имя',
      });
    };


    const emailValidate = () => {
      if (!formData?.email?.value?.toLowerCase().match(
          // eslint-disable-next-line max-len
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )) {
        updateFormError({value: 'Некоректный Email', field: 'email'});
      } else updateFormError({value: '', field: 'email'});
    };

    const passwordValidate = () => {
      if (activeUser.id === '-1' || formData.password.value) {
        lengthValidate({
          field: 'password', length: 6, message: 'Слишком короткий пароль',
        });
      }
    };

    const repeatPasswordValidate = () => {
      if (activeUser.id === '-1' || formData.password.value) {
        if (formData.password?.value && formData.repeatPassword?.value) {
          if (formData.password?.value === formData.repeatPassword?.value) {
            updateFormError({value: '', field: 'repeatPassword'});
            return;
          }
        }
        updateFormError({value: 'Пароли не совпадают', field: 'repeatPassword'});
      }
    };

    const disableSubmit = () => {
      let res = false;
      Object.keys(formData).forEach((el) => {
        if (formData[el].error) res = true;
      });
      return res;
    };


    const handleSubmit = () => {
      nameValidate();
      emailValidate();
      if (activeUser.id === '-1') {
        passwordValidate();
        repeatPasswordValidate();
        if (!disableSubmit()) {
          createUser({
            variables: {
              input: {
                password: formData.password.value,
                email: formData.email.value,
                name: formData.name.value,
              },
            },
          }).then((res) => {
            console.log(res);
            handleClose();
            refetch();
          }).catch((err) => {
            console.log(err);
            handleClose();
            handleSnackbarOpen();
            refetch();
          });
        }
      } else {
        if (formData.password) {
          passwordValidate();
          repeatPasswordValidate();
          if (!disableSubmit()) {
            const input: { id: string, email: string, name: string, password?: string } = {
              id: activeUser.id,
              email: formData.email.value,
              name: formData.name.value,
            };
            if (formData.password.value) {
              input.password = formData.password.value;
            }
            updateUser({variables: {input}}).then((res) => {
              console.log(res);
              handleClose();
              refetch();
            }).catch((err) => {
              console.log(err);
              handleClose();
              handleSnackbarOpen();
              refetch();
            });
          }
        }
      }
    };


    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {activeUser?.id !== '-1' ? 'Редактировать' : 'Создать пользователя'}

        </DialogTitle>
        <DialogContent>
          <TextField
            error={!!formData.name.error}
            helperText={formData.name.error}
            onBlur={nameValidate}
            required
            autoFocus
            label={'Имя'}
            margin="dense"
            id="name"
            // placeholder=""
            type="text"
            fullWidth
            variant="standard"
            value={formData.name.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateFormValue({value: e.target.value, field: 'name'});
            }}
          />
          <TextField
            error={!!formData.email.error}
            helperText={formData.email.error}
            onBlur={emailValidate}
            required
            label={'Email'}
            margin="dense"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateFormValue({value: e.target.value, field: 'email'});
            }}
          />
          <TextField
            error={!!formData.password.error}
            helperText={formData.password.error}
            onBlur={passwordValidate}
            required={activeUser.id === '-1'}
            label={activeUser.id === '-1' ? 'Пароль' : 'Сбросить пароль'}
            margin="dense"
            type="password"
            inputProps={{
              autocomplete: 'new-password',
              form: {
                autocomplete: 'off',
              },
            }}
            fullWidth
            variant="standard"
            value={formData.password.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateFormValue({value: e.target.value, field: 'password'});
            }}
          />

          {(activeUser.id === '-1' || formData.password.value) && (
            <TextField
              error={!!formData.repeatPassword.error}
              helperText={formData.repeatPassword.error}
              onBlur={repeatPasswordValidate}
              required={activeUser.id === '-1' || !!formData.password.value}
              label={'Повторите пароль'}
              margin="dense"
              type="password"
              fullWidth
              variant="standard"
              value={formData.repeatPassword.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateFormValue({value: e.target.value, field: 'repeatPassword'});
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button sx={{background: 'rgba(0,0,0,0.50)'}}
            variant={'contained'}
            onClick={handleClose}>
                    Отмена
          </Button>
          <Button
            disabled={disableSubmit()}
            variant={'contained'}
            onClick={handleSubmit}>
            {activeUser.id != '-1' ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    );
};
