function Header() {
  return (
    <div
      style={{
        minHeight: 50,
        maxHeight: 50,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <div>Header item 1</div>
      <div>Header item 2</div>
      <div>Header item 3</div>
    </div>
  );
}

export default Header;
