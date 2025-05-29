import { toast } from "sonner";

const useCustomToast = () => {
  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-right",
      duration: 5000,
      closeButton: true,
    });
  };

  return { showErrorToast };
};

export default useCustomToast;
