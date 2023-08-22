

var tasks = document.querySelector("#task-field");
var userinput = document.querySelector("#user-input");
var p_nothing = document.querySelector("#task-field-nothing");


/**
 * Implementation of task field
 */
var TaskField = {
    DOM: document.querySelector("#task-field"),

    getChilds: function () {
        return document.querySelectorAll("div.taskelem");
    },

    count: function () {
        return this.DOM.childElementCount - 1;
    },

    updateView: function (scroll_status = true) {
        if (this.count()) {
            p_nothing.style.display = "none";
            document.title = `(${this.count()} task${this.count() === 1 ? '' : 's'}) - ToDo Manager`;
        } else {
            p_nothing.style.display = "inherit";
            document.title = `You are free! - ToDo Manager`;
        }
        document.querySelector("#h2-actual_tasks").innerText = `Actual tasks (${this.count()})`;
        if (scroll_status) window.scrollTo(0, document.body.scrollHeight);
    },

    /**
     * Remove task from field by its id
     * @param {Number} task_id task's id
     */
    rm: function (task_id) {
        let task = document.querySelector(`div.neu.taskelem[data-task_id="${task_id}"]`);
        task.remove();
        localStorage.removeItem(task_id)

        this.updateView(false);
    },

    /**
     * Заполняет список задач из `localStorage`
     */
    fill: function () {
        if (Object.keys(localStorage).length) {

            for (const id of Object.keys(localStorage).sort()) {
                this.add(localStorage.getItem(id), id);
            }
        }
    },

    /**
     * Отрисовывает задачу в перечне задач
     * @param {String} task_text Текст задачи
     * @param {Number} task_id Идентификатор задачи (обычно это время). Необязательный аргумент
     */
    draw: function (task_text, task_id) {
        let TASK_ID = task_id || new Date().getTime();

        let div_keyboard = document.createElement("div");
        div_keyboard.style.marginLeft = "auto";
        div_keyboard.style.left = 0;
        div_keyboard.style.position = "inherit";
        div_keyboard.classList = "task-keyboard"

        let kb_complete = document.createElement("button");
        kb_complete.classList = "neu m0 keyboard_complete";
        kb_complete.innerText = "✔ Complete";
        kb_complete.style.margin = "20px 5px"
        div_keyboard.appendChild(kb_complete);

        let kb_delete = document.createElement("button");
        kb_delete.classList = "neu m0 keyboard_delete";
        kb_delete.innerText = "✖ Delete";
        kb_delete.style.margin = "20px 5px";
        kb_delete.addEventListener("click", () => this.rm(TASK_ID));
        div_keyboard.appendChild(kb_delete);

        // let kb_moveup = document.createElement("button");
        // kb_moveup.classList = "neu m0 keyboard_moveup i";
        // kb_moveup.innerText = "↑";
        // kb_moveup.style.margin = "20px 5px";
        // div_keyboard.appendChild(kb_moveup);

        // let kb_movedown = document.createElement("button");
        // kb_movedown.classList = "neu m0 keyboard_movedown i";
        // kb_movedown.innerText = "↓";
        // kb_movedown.style.margin = "20px 5px";
        // div_keyboard.appendChild(kb_movedown);

        // kb_complete.hidden = true;
        // kb_delete.hidden = true;
        // kb_moveup.hidden = true;
        // kb_movedown.hidden = true;


        let div_text = document.createElement("div")
        div_text.classList = "task-text";
        div_text.innerText = task_text;

        let div = document.createElement("div");
        div.setAttribute("data-task_id", TASK_ID);
        div.classList = "neu taskelem";
        div.innerHTML = `<div style="color: grey;">⏱ ${new Date(new Number(TASK_ID)).toLocaleDateString()} - ${new Date(new Number(TASK_ID)).toLocaleTimeString()}</div>`

        div.appendChild(div_text);
        div.appendChild(div_keyboard);

        div.addEventListener("click", () => {
            // kb_complete.hidden = false;
            // kb_delete.hidden = false;
            // kb_moveup.hidden = false;
            // kb_movedown.hidden = false;

            div.classList.add("show");
            div_text.classList.add("show");
            div_keyboard.classList.add("show");
        });
        div.addEventListener("mouseleave", () => {

            // kb_complete.hidden = true;
            // kb_delete.hidden = true;
            // kb_moveup.hidden = true;
            // kb_movedown.hidden = true;


            div.classList.remove("show");
            div_text.classList.remove("show");
            div_keyboard.classList.remove("show");
        });

        this.DOM.appendChild(div);
        this.updateView();

        return TASK_ID;
    },

    add: function (task_text, task_id) {
        localStorage.setItem(this.draw(task_text, task_id), task_text);
    },

    /**
     * Remove the first task from field
     */
    shift: function () {
        TaskField.rm(new Number(Object.keys(localStorage).sort().shift()));
    },

    /**
     * Remove the last task from field
     */
    pop: function () {
        TaskField.rm(new Number(Object.keys(localStorage).sort().pop()));
    },

    addByUserInput: function () {
        if (userinput.value && userinput.value.length <= 200) {
            TaskField.add(userinput.value, new Date().getTime())
            userinput.value = new String();
        }
    }
}


TaskField.fill();
TaskField.updateView();

document.querySelector("#button-addtolist").addEventListener("click", TaskField.addByUserInput);
document.querySelector("#kbmain-shift").addEventListener("click", TaskField.shift);
document.querySelector("#kbmain-pop").addEventListener("click", TaskField.pop);

userinput.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) TaskField.addByUserInput();
})