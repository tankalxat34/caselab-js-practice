

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
            document.title = `${this.count()} task${this.count() === 1 ? '' : 's'} - ToDo Manager`;
            document.querySelector("#h2-actual_tasks").innerText = `Actual tasks (${this.count()})`;
        } else {
            p_nothing.style.display = "auto";
            document.title = `You are free! - ToDo Manager`;
        }
        if (scroll_status) window.scrollTo(0, document.body.scrollHeight);
    },

    remove: function (task_id) {
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
            for (const id of Object.keys(localStorage)) {
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
        div_keyboard.hidden = true;
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
        kb_delete.addEventListener("click", () => this.remove(TASK_ID));
        div_keyboard.appendChild(kb_delete);
    
        let div_text = document.createElement("div")
        div_text.classList = "task-text";
        div_text.innerText = task_text;
        div_text.style.whiteSpace = "nowrap";
        div_text.style.overflow = "hidden";
        div_text.style.textOverflow = "ellipsis";
    
        let div = document.createElement("div");
        div.style.verticalAlign = "middle";
        div.setAttribute("data-task_id", TASK_ID);
        div.classList = "neu taskelem";
        div.innerHTML = `<div style="color: grey;">⏱ ${new Date(new Number(TASK_ID)).toLocaleDateString()} - ${new Date(new Number(TASK_ID)).toLocaleTimeString()}</div>`
        
        div.appendChild(div_text);
        div.appendChild(div_keyboard);

        div.addEventListener("click", () => {
            div_keyboard.hidden = false;

            div_text.style.whiteSpace = "normal";
            div_text.style.overflow = "auto";
            div_text.style.textOverflow = "clip";

            div_text.classList.add("show");
        });
        div.addEventListener("mouseleave", () => {
            div_keyboard.hidden = true

            div_text.style.whiteSpace = "nowrap";
            div_text.style.overflow = "hidden";
            div_text.style.textOverflow = "ellipsis";

            div_text.classList.remove("show");
        });

        this.DOM.appendChild(div);
        this.updateView();

        return TASK_ID;
    },

    add: function (task_text, task_id) {
        localStorage.setItem(this.draw(task_text, task_id), task_text);
    }
}


TaskField.fill();
TaskField.updateView();

// document.querySelector("#button-addtolist").addEventListener("click", TaskField.add);
userinput.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 && userinput.value) {
        TaskField.add(userinput.value, new Date().getTime())
        userinput.value = new String();
    }
})