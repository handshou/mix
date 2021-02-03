import logo from "../logo.svg";

function Body(props) {
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        wigth: "100%",
      }}
    >
      <div>
        <button
          onClick={() => {
            if (props.getUsers !== undefined) {
              props.getUsers();
            } else console.log("lmao it didnt work");
          }}
        >
          Get user information from firebase
        </button>
      </div>
      <div>
        {props.userList && props.userList.length > 0 ? (
          props.userList.map((val) => {
            return <div>{JSON.stringify(val)}</div>;
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Body;
