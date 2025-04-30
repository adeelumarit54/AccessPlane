
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        padding:"2px"
    },
    table: {
        border: "1px solid gray",
        borderCollapse: "collapse",
        width: "100%",
        marginTop: "-1px",
    },

    tableHeader: {
        border: "1px solid gray",
        textAlign: "center",
        fontWeight:"bolder",
        fontSize: "smaller"

    },
    tableCell: {
        border: "1px solid gray",
        textAlign: "center",
        fontSize: "smaller"

    },
    tableCellText: {
        fontSize: "smaller",
        fontWeight: "600",
    },
    safeCell: {
        backgroundColor: "#d4edda",
    },
    unsafeCell: {
        backgroundColor: "#f8d7da",
    },
    warningText: {
        fontWeight: "600",
        fontSize: "12px",
    },
    iconColumn: {
        width: "40px", // Narrow column for icons
    },
    riskLevelColumn: {
        width: "100px", // Narrow column for Risk Level
    },
});

export default useStyles;