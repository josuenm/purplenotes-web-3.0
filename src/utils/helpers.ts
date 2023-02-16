import { UserProps } from "@/types/user-props";

const formatHtml = (body: string, limit?: number) => {
  let newBody = body.replace(/<(.|\n)*?>/gi, "");

  if (!limit) {
    return newBody;
  }

  if (newBody.length >= limit) {
    return newBody.slice(0, limit) + "...";
  }
  return newBody;
};

// BEGIN: user helper
const memoryName = "purplenotes.user";

const saveUser = (user: UserProps) =>
  localStorage.setItem(
    memoryName,
    JSON.stringify({
      name: user.name,
      email: user.email,
      accountConfirmation: {
        email: user.accountConfirmation.email,
        isConfirmed: user.accountConfirmation.isConfirmed,
      },
    })
  );

const getUser = (): UserProps =>
  JSON.parse(localStorage.getItem(memoryName) as string);

const removeUser = () => localStorage.removeItem(memoryName);
// END: user helper

export { formatHtml, saveUser, getUser, removeUser };
