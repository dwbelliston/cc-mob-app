import { Box, IconButton, useToast } from "native-base"
import { Icon } from "../components"
import { Butter, IButterBaseProps } from "../components/Butter"

interface IButterToastProps extends IButterBaseProps {
  id: string
  onClose: () => void
}

const ToastAlert = ({ id, title, description, status, onClose, ...rest }: IButterToastProps) => (
  <Box w={{ base: "xs", lg: "md" }}>
    <Butter.Base title={title} description={description} status={status}>
      <Box>
        <IconButton
          variant={"ghost"}
          onPress={onClose}
          icon={<Icon colorToken={"text.soft"} icon="xMark" size={24} />}
        />
      </Box>
    </Butter.Base>
  </Box>
)

export const useCustomToast = () => {
  const toast = useToast()

  const customShow = (props: Omit<IButterToastProps, "id" | "onClose">) => {
    toast.show({
      render: ({ id }) => {
        return <ToastAlert id={id} onClose={() => toast.close(id)} {...props} />
      },
    })
  }

  const customSuccessShow = (props: Omit<IButterToastProps, "id" | "onClose">) => {
    customShow({ ...props, status: "success" })
  }

  const customErrorShow = (props: Omit<IButterToastProps, "id" | "onClose">) => {
    customShow({ ...props, status: "error" })
  }
  const customInfoShow = (props: Omit<IButterToastProps, "id" | "onClose">) => {
    customShow({ ...props, status: "info" })
  }
  const customWarningShow = (props: Omit<IButterToastProps, "id" | "onClose">) => {
    customShow({ ...props, status: "warning" })
  }

  return {
    ...toast,
    show: customShow,
    success: customSuccessShow,
    error: customErrorShow,
    info: customInfoShow,
    warning: customWarningShow,
  }
}
