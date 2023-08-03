exports.OTP = async (otpReq) => {
  let otp;
  let result;
  if (otpReq) {
    otpReq === otp
      ? (result = `Verify Successfullly`)
      : (result = `Verification failed`);
    return result;
  } else {
    return (otp = Math.floor(1000 + Math.random() * 9000));
  }
};
