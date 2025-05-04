import umiyaLogo from "../../../public/images/logo.jpg";

export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src={umiyaLogo}
            alt="Umiya Acid & Chemical"
            style={{ width: "10rem", height: "10rem" }}
        />
    );
}
