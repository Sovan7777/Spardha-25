import * as Yup from 'yup';

export const registrationSchema = Yup.object().shape({
  event: Yup.string().required('Event is required'),
  college: Yup.string().required('College is required'),
  captainName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Captain name should not contain numbers or special characters')
    .required('Captain name is required'),
  captainId: Yup.string()
    .matches(/^[A-Z0-9]+$/, 'Captain ID must be uppercase and contain no special characters')
    .required('Captain ID is required'),
  captainMobile: Yup.string()
    .matches(/^[1-9][0-9]{9}$/, 'Mobile number must be 10 digits, should not start with 0')
    .required('Captain mobile number is required'),
    captainGender: Yup.string().required("Please select the captain's gender"),
  gmail: Yup.string()
    .email('Invalid email')
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a valid Gmail address')
    .required('Email is required'),
  idCardPic: Yup.mixed()
    .test('fileSize', 'File size is too large (max 2MB)', (file) => !file || file.size <= 2 * 1024 * 1024)
    .test('fileType', 'Only image files are allowed', (file) =>
      !file || ['image/jpeg', 'image/jpg'].includes(file.type)
    )
    .required('Captain ID card picture is required'),
  players: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Player name should not contain numbers or special characters')
          .required('Player name is required'),
        id: Yup.string()
          .matches(/^[A-Z0-9]+$/, 'Player ID must be uppercase and contain no special characters')
          .required('Player ID is required'),
        mobile: Yup.string()
          .matches(/^[1-9][0-9]{9}$/, 'Mobile number must be 10 digits and not start with 0')
          .required('Player mobile number is required'),
        playerIdCardPic: Yup.mixed()
          .test('fileSize', 'File size is too large (max 2MB)', (file) => !file || file.size <= 2 * 1024 * 1024)
          .test('fileType', 'Only image files are allowed', (file) =>
            !file || ['image/jpeg', 'image/jpg'].includes(file.type)
          )
          .required('Player ID card picture is required'),
          gender: Yup.string().required("Player gender is required"),
      })
    )
    .test('unique-player-fields', 'Each player must have unique ID, name, and mobile', function (players) {
      if (!players) return true;

      const isUnique = (field) => field.length === new Set(field).size;

      const ids = players.map((player) => player.id);
      const names = players.map((player) => player.name);
      const mobiles = players.map((player) => player.mobile);

      return isUnique(ids) && isUnique(names) && isUnique(mobiles);
    }),
  upiId: Yup.string().required('Transaction ID is required'),
  transactionScreenshot: Yup.mixed()
    .test('fileSize', 'File size is too large (max 2MB)', (file) => !file || file.size <= 2 * 1024 * 1024)
    .test('fileType', 'Only image files are allowed', (file) =>
      !file || ['image/jpeg', 'image/jpg'].includes(file.type)
    )
    .required('Transaction screenshot is required'),
});
