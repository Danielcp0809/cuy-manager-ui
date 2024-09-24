import moment from "moment-timezone";

export const getFormattedDate = (date: any) => {
    return moment(new Date(Number(date))).format("DD/MM/YYYY HH:mm");
}