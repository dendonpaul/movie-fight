const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelected,
  inputValue,
  fetchData,
}) => {
  //DOM Elements
  root.innerHTML = `
    <div class="dropdown">
      <div class="dropdown-trigger">
        <input type="text" placeholder="Enter item name" class="input is-large" />
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content results">

        </div>
      </div>
    </div>
`;
  const input = root.querySelector(".input");
  const dropdown = root.querySelector(".dropdown");
  const resultWrapper = root.querySelector(".results");

  //Clear dropdown content
  const clearContent = () => {
    resultWrapper.innerHTML = "";
  };

  //Display the items in dropdown box
  const displayitems = (items) => {
    dropdown.classList.add("is-active");
    if (items.length <= 0) {
      clearContent();
      const div = document.createElement("div");
      div.innerHTML = "No items Found";
      resultWrapper.appendChild(div);
    } else {
      clearContent();
      items.forEach((item) => {
        const options = document.createElement("a");

        options.classList.add("dropdown-item");
        options.innerHTML += renderOption(item);
        options.addEventListener("click", () => {
          dropdown.classList.remove("is-active");
          input.value = inputValue(item);
          onOptionSelected(item);
        });
        resultWrapper.appendChild(options);
      });
    }
  };

  //Trigger API when when data entered in input field
  const onInput = async (event) => {
    const itemsList = await fetchData(event.target.value);
    displayitems(itemsList);
  };

  //input event listener
  input.addEventListener("input", timer(onInput, 500));

  //close popup when clicked outside
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
