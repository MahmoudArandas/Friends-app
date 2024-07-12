import React, { Children, useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <>
      <button onClick={onClick} className="button">
        {children}
      </button>
    </>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isopen, setIsopen] = useState(null);
  const [select, setSelect] = useState(null);

  function handelselect(friend) {
    setSelect((cur) => (cur?.id === friend.id ? null : friend));
  }
  function handelisopen() {
    setIsopen((show) => !show);
  }
  function handelAddfriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  function handeldelet(friend) {
    setFriends((friends) => friends.filter((del) => del.id !== friend));
  }
  function handelsplitbill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === select.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelect(null);
  }
  return (
    <div className="app">
      <div className="sidepar">
        <FriendsList
          friends={friends}
          handelselect={handelselect}
          select={select}
          handeldelet={handeldelet}
        />

        <FormAddFriens handelAddfriend={handelAddfriend} isopen={isopen} />

        <Button onClick={handelisopen}>{isopen ? "Add Friend" : "Add"}</Button>
      </div>
      <div>
        {select && (
          <FormSplitBill select={select} handelsplitbill={handelsplitbill} />
        )}
      </div>
    </div>
  );
}

function FriendsList({ friends, handelselect, select, handeldelet }) {
  return (
    <>
      <div className="sidebar">
        <ul>
          {friends.map((friend) => (
            <Friend
              friend={friend}
              handelselect={handelselect}
              select={select}
              key={friend.id}
              handeldelet={handeldelet}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
function Friend({ friend, handelselect, select, handeldelet }) {
  const isSlected = select?.id === friend.id;
  return (
    <>
      <li className={isSlected ? "selected" : ""}>
        <img className="p-2" src={friend.image} alt={friend.image} />
        <h3 className="p-2"> {friend.name}</h3>
        <p>
          {friend.balance < 0 && (
            <p className="red">
              you owe{friend.name} {Math.abs(friend.balance)}$
            </p>
          )}
          {friend.balance > 0 && (
            <p className="green">
              {friend.name} owes you {Math.abs(friend.balance)}$
            </p>
          )}
          {friend.balance === 0 && <p>you and{friend.name} are even</p>}
        </p>
        <Button onClick={() => handelselect(friend)}>
          {isSlected ? "Close" : "Select"}
        </Button>
        <Button onClick={() => handeldelet(friend.id)}>delet</Button>
      </li>
    </>
  );
}
function FormAddFriens({ handelAddfriend, isopen }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=933372");

  const id = crypto.randomUUID();
  function handeladdfrinds(e) {
    e.preventDefault();
    let newdtatafriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balence: 0,
    };
    handelAddfriend(newdtatafriend);
    setName("");
  }

  return (
    <>
      {isopen ? (
        <form className="form-add-friend" onSubmit={handeladdfrinds}>
          <label> Friend Name</label>
          <input
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <label>Image url</label>
          <input
            value={image}
            type="text"
            onChange={(e) => setImage(e.target.value)}
          />

          <Button>Add</Button>
        </form>
      ) : (
        ""
      )}
    </>
  );
}

function FormSplitBill({ select, handelsplitbill }) {
  const [bill, setBill] = useState("");
  const [paidbyuser, setPaidbyuser] = useState("");
  const [whoispaing, setWhoispaing] = useState("user");

  let paidbyfriend = paidbyuser - bill;
  function onSubmit(e) {
    e.preventDefault();
    handelsplitbill(whoispaing === "user" ? paidbyfriend : -paidbyfriend);
  }

  return (
    <>
      <form className="form-split-bill" onSubmit={onSubmit}>
        <h2>
          Split bill with <span className="text-info"> {select.name}</span>
        </h2>

        <label> Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />

        <label> your Expense</label>
        <input
          type="text"
          value={paidbyuser}
          onChange={(e) => setPaidbyuser(Number(e.target.value))}
        />

        <label>{select.name}'s Expense</label>
        <input
          type="text"
          disabled
          value={paidbyfriend < 0 ? 0 : paidbyfriend}
        />
        <label>Who is paing the bill ?</label>
        <select
          value={whoispaing}
          onChange={(e) => setWhoispaing(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{select.name} </option>
        </select>
        <Button>Spillt Bill</Button>
      </form>
    </>
  );
}
