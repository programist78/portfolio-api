export const fileRenamer = (filename) => {
    const queHoraEs = Date.now();
    const regex = /[\s_-]/gi;
    const fileTemp = filename.replace(regex, ".");
    let arrTemp = [fileTemp.split(".")];
  return `${arrTemp[0]
  .slice(0, arrTemp[0].length - 1)
  .join("_")}${queHoraEs}.${arrTemp[0].pop()}`;
};