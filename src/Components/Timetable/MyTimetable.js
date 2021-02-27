import {React, useState} from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {makeStyles} from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import Timetable from './Timetable';

const useStyles = makeStyles(theme => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function MyTimetable(props) {
  const classes = useStyles();
  const [week, setWeek] = useState(1);
  const handleChange = (event, value) => {
    setWeek(value);
  };

  return (
    <div>
      <input accept="image/*" id="contained-button-file" multiple type="file" />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="default"
          component="span"
          startIcon={<CloudUploadIcon />}>
          Upload
        </Button>
      </label>
      <input accept="image/*" id="icon-button-file" type="file" />

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className={classes.root}>
          <Pagination
            count={13}
            page={week}
            siblingCount={0}
            onChange={handleChange}
          />
        </div>

      </div>
        <Timetable weekNumber={week} />

    </div>
  );
}
