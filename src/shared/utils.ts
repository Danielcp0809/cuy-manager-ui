import moment from "moment-timezone";

export const getFormattedDate = (date: any, addTime: boolean = true) => {
    return moment(new Date(Number(date))).format(addTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY");
}