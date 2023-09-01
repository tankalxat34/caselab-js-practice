

var userinput = document.querySelector("#user-input");
var p_nothing = document.querySelector("#task-field-nothing");
var p_completed_nothing = document.querySelector("#task-field-completed_nothing");


/**
 * Implementation of task field
 */
var TaskField = {
    DOM: document.querySelector("#task-field > #task-field-nothing"),
    DOM_COMPLETED: document.querySelector("#task-field-completed > #task-field-completed_nothing"),

    DOM_FIELD_ACTUAL: document.querySelector("#task-field"),
    DOM_FIELD_COMPLETED: document.querySelector("#task-field-completed"),

    getChilds: function () {
        return document.querySelectorAll("div.taskelem");
    },

    count: function () {
        return this.DOM_FIELD_ACTUAL.childElementCount - 1;
    },

    countCompleted: function () {
        return this.DOM_FIELD_COMPLETED.childElementCount - 1;
    },

    updateView: function (scroll_status = true) {
        if (this.count()) {
            p_nothing.style.display = "none";
            document.title = `(${this.count()} task${this.count() === 1 ? '' : 's'}) - ToDo Manager`;
        } else {
            p_nothing.style.display = "inherit";
            document.title = `You are free! - ToDo Manager`;
        }

        if (this.countCompleted()) {
            p_completed_nothing.style.display = "none";
        } else {
            p_completed_nothing.style.display = "inherit";
        }
        document.querySelector("#h2-actual_tasks").innerText = `Actual tasks (${this.count()})`;
        document.querySelector("#h2-completed_tasks").innerText = `Completed tasks (${this.countCompleted()})`;
        if (scroll_status) window.scrollTo(0, document.body.scrollHeight);
    },

    /**
     * Remove task from field by its id
     * @param {Number} task_id task's id
     */
    rm: function (task_id) {
        let task = document.querySelector(`div.taskelem[data-task_id="${task_id}"]`);

        if (task) {
            task.remove();
            localStorage.removeItem(task_id);
    
            this.updateView(false);
        }
    },

    /**
     * Fills the list of tasks from `localStorage`
     */
    fill: function () {
        if (Object.keys(localStorage).length) {

            for (const id of Object.keys(localStorage).sort()) {
                this.draw(localStorage.getItem(id), id, id > 0 ? this.DOM : this.DOM_COMPLETED);
            }
        }
    },

    /**
     * Draws the task in the task list
     * @param {String} task_text Task text
     * @param {Number} task_id Task identifier (usually time). Optional argument
     * @param {Element} DOM_field Field where needs to place the task
     */
    draw: function (task_text, task_id, DOM_field) {
        let TASK_ID = task_id || new Date().getTime();

        let div_keyboard = document.createElement("div");
        div_keyboard.style.marginLeft = "auto";
        div_keyboard.style.left = 0;
        div_keyboard.style.position = "inherit";
        div_keyboard.classList = "task-keyboard"

        if (DOM_field === TaskField.DOM) {
            let kb_complete = document.createElement("button");
            kb_complete.classList = "neu m0 keyboard_complete";
            kb_complete.innerText = "✔ Complete";
            kb_complete.style.margin = "20px 5px";
            kb_complete.addEventListener("click", () => this.complete(TASK_ID));
            div_keyboard.appendChild(kb_complete);
        }

        let kb_delete = document.createElement("button");
        kb_delete.classList = "neu m0 keyboard_delete";
        kb_delete.innerText = "✖ Delete";
        kb_delete.style.margin = "20px 5px";
        kb_delete.addEventListener("click", () => this.rm(TASK_ID));
        div_keyboard.appendChild(kb_delete);

        let div_text = document.createElement("div");
        div_text.classList = "task-text";
        div_text.innerText = task_text;

        let div = document.createElement("div");
        div.setAttribute("data-task_id", TASK_ID);
        div.classList = "neu taskelem";
        div.innerHTML = `<p class="task-created_at" style="color: grey;">⏱ ${new Date(new Number(Math.abs(TASK_ID))).toLocaleDateString()} - ${new Date(new Number(Math.abs(TASK_ID))).toLocaleTimeString()}</p>`

        if (DOM_field === TaskField.DOM_COMPLETED) {
            div.classList.add("line-through");
        }

        div.appendChild(div_text);
        div.appendChild(div_keyboard);

        div.addEventListener("click", () => {
            div.classList.add("show");
            div_text.classList.add("show");
            div_keyboard.classList.add("show");
        });
        div.addEventListener("mouseleave", () => {
            div.classList.remove("show");
            div_text.classList.remove("show");
            div_keyboard.classList.remove("show");
        });

        if (DOM_field === this.DOM) {
            DOM_field.after(div);
        } else if (DOM_field === this.DOM_COMPLETED) {
            DOM_field.before(div);
        }
        this.updateView(false);

        return TASK_ID;
    },

    /**
     * Save task to local storage
     * @param {Number} task_id The task's id
     * @param {String} task_text The task's text
     * @param {Element} DOM_field Field where needs to place the task
     */
    saveToLocalStorage: function (task_id, task_text, DOM_field) {
        localStorage.setItem(this.draw(task_text, task_id, DOM_field), task_text);
    },

    /**
     * Remove the first task from field
     */
    shift: function () {
        TaskField.rm(new Number(Object.keys(localStorage).sort().pop()));
    },
    
    /**
     * Remove the last task from field
    */
   pop: function () {
        TaskField.rm(new Number(Object.keys(localStorage).sort().shift()));
    },

    /**
     * Mark the task as completed
     * @param {Number} task_id The task's id
     */
    complete: function (task_id) {
        let task_text = document.querySelector(`div.taskelem[data-task_id="${task_id}"] > div.task-text`);
        let task_kb_complete = document.querySelector(`div.taskelem[data-task_id="${task_id}"] > div.task-keyboard > button.keyboard_complete`);
        task_kb_complete.hidden = true;

        let completed_task_id = -task_id;
        this.rm(task_id);
        this.saveToLocalStorage(completed_task_id, task_text.innerText, this.DOM_COMPLETED);
    },

    addByUserInput: function () {
        if (userinput.value && userinput.value.length <= 200) {
            TaskField.saveToLocalStorage(new Date().getTime(), userinput.value, TaskField.DOM);
            userinput.value = new String();
        }
    },

    markOnlyEven: function () {
        let i = 0;
        TaskField.getChilds().forEach(el => {
            el.classList.remove("selection");
            if (i % 2 === 0) el.classList.add("selection");
            i++;
        });
    },

    markOnlyOdd: function () {
        let i = 0;
        TaskField.getChilds().forEach(el => {
            el.classList.remove("selection");
            if (i % 2 != 0) el.classList.add("selection");
            i++;
        });
    },

    unmarkSelection: function () {
        TaskField.getChilds().forEach(el => {
            el.classList.remove("selection");
        });
    }
}



TaskField.fill();
TaskField.updateView();

window.onload = () => {
    document.querySelector("#button-addtolist").addEventListener("click", TaskField.addByUserInput);
    document.querySelector("#kbmain-shift").addEventListener("click", TaskField.shift);
    document.querySelector("#kbmain-pop").addEventListener("click", TaskField.pop);
    document.querySelector("#kbmain-show-even").addEventListener("click", TaskField.markOnlyEven);
    document.querySelector("#kbmain-show-odd").addEventListener("click", TaskField.markOnlyOdd);

    document.querySelector("#kb-manage_fields").addEventListener("mouseleave", TaskField.unmarkSelection)
}

userinput.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) TaskField.addByUserInput();
})