import moment from "moment";

export default function round(date, duration, method) {
  return moment(Math[method](+date / +duration) * +duration);
}
