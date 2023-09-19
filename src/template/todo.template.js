const template = /* html */ `
<div class="content">
{{#if completed}}
    <input
    type="checkbox"
    class='todo_checkbox' 
    checked
    />
    <label>{{content}}</label>
    <input type="text" value="{{content}}" />
{{else}}
    <input
    type="checkbox"
    class='todo_checkbox' 
    />
    <label>{{content}}</label>
    <input type="text" value="{{content}}" />
{{/if}}
</div>
<div class="item_buttons content_buttons">
    <button class="todo_edit_button">
        <i class="far fa-edit"></i>
    </button>
    <button class="todo_remove_button">
        <i class="far fa-trash-alt"></i>
    </button>
</div>
<div class="item_buttons edit_buttons">
    <button class="todo_edit_confirm_button">
        <i class="fas fa-check"></i>
    </button>
    <button class="todo_edit_cancel_button">
        <i class="fas fa-times"></i>
    </button>
</div>
`;

export default Handlebars.compile(template);
