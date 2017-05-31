var vm = new Vue({
    el: '#app',
    data: {
        thing: '',
        todos: [],
        obj: {},
        state: '',
        currentTodo: ''
    },
    directives: {
        // ele: input元素,
        // bindings.value: currentTodo==todo的结果
        autoFocus(ele, bindings) {
            if (bindings.value) {
                ele.focus();
            }
        }
    },
    methods: {
        add() {
            let obj = {title: this.thing, isChecked: false};
            this.todos.push(obj);
            this.thing = '';
        },
        remove(todo) {
            this.todos = this.todos.filter(function (item) {
                return item != todo;
            });
        },
        changeTitle(todo) {
            this.currentTodo = todo;
            for (var key in todo) {
                if (todo.hasOwnProperty(key)) {
                    this.obj[key] = todo[key];
                }
            }
        },
        reset() {
            this.currentTodo = '';
        },
        cancel(todo) {
            this.todos = this.todos.map(function (item) {
                if (item == todo) {
                    return vm.obj;
                }
                return item;
            });
            this.obj = {};
            this.currentTodo = '';
        }
    },
    mounted() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    watch: {
        todos: {
            handler() {
                localStorage.setItem('todos', JSON.stringify(this.todos));
            },
            deep: true
        }
    },
    computed: {
        cloneTodo() {
            if (this.state == 'complete') { // 全部 返回所有数据
                return this.todos;
            }
            if (this.state == 'finish') {   // 完成 返回checked为true的数据
                return this.todos.filter(function (item) {
                    return item.isChecked;
                });
            }
            if (this.state == 'unfinish') { // 未完成
                return this.todos.filter(function (item) {
                    return !item.isChecked;
                });
            }
        },
        total() {
            return this.todos.filter(function (item) {
                return !item.isChecked;
            }).length;
        }
    }
});

let listener = function () {
    // 当hash值变化时将当前hash值赋予给state
    vm.state = window.location.hash.slice(1) || 'complete';
}
listener();
window.addEventListener('hashchange', listener, false);