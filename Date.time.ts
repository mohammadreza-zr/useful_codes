import moment from "jalali-moment";

const toTime = (date: any) => {
  if (moment(date).isValid()) {
    return moment(date).locale("fa").format("HH:mm");
  }
};
const toDate = (date: any) => {
  if (moment(date).isValid()) {
    return moment(date).locale("fa").format("YYYY/MM/DD");
  }
};
const toDay = (date: any) => {
  if (moment(date).isValid()) {
    return moment(date).locale("fa").format("ddd");
  }
};

export const dateConverter = {
  toDate,
  toTime,
  toDay,
};
