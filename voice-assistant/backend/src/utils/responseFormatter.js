export const formatActionResult = ({
  success,
  action,
  data = {},
  message = "",
  error = "",
}) => ({
  success: Boolean(success),
  action: action || "",
  data,
  message,
  error,
});
