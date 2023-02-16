export type UserProps = {
  email: string;
  name: string;
  accountConfirmation: {
    email: string;
    isConfirmed: string;
  };
};
