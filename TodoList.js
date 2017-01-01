var TodoList = (function () { 'use strict';

function applyComputations ( state, newState, oldState ) {
	if ( ( 'todoItems' in newState && typeof state.todoItems === 'object' || state.todoItems !== oldState.todoItems ) ) {
		state.undoneTodos = newState.undoneTodos = template.computed.undoneTodos( state.todoItems );
	}
	
	if ( ( 'todoItems' in newState && typeof state.todoItems === 'object' || state.todoItems !== oldState.todoItems ) ) {
		state.doneTodos = newState.doneTodos = template.computed.doneTodos( state.todoItems );
	}
}

var template = (function () {
  return {
    data () {
      return {
				listTitle: "Generic TODO list",
        todoItems: [],
				newTodoItemTitle: ''
      };
    },
	
		computed: {
			undoneTodos: todoItems => todoItems.filter(item => !item.done),
			doneTodos: todoItems => todoItems.filter(item => item.done)
		},
		
		methods: {
			addNewTodo (newTodoItemTitle) {
				const todoItems = this.get('todoItems');
				
				todoItems.push({
					title: newTodoItemTitle,
					done: false
				});
				
				this.set({todoItems});
				this.refs.newTodo.value = '';
			}
		}
  };
}());

function renderMainFragment ( root, component ) {
	var h1 = createElement( 'h1' );
	
	var text = createText( root.listTitle );
	appendNode( text, h1 );
	var text1 = createText( "\r\n\r\n" );
	
	var input = createElement( 'input' );
	input.type = "text";
	component.refs.newTodo = input;
	
	var input_updating = false;
	
	function inputChangeHandler () {
		input_updating = true;
		component.set({ newTodoItemTitle: input.value });
		input_updating = false;
	}
	
	input.addEventListener( 'input', inputChangeHandler, false );
	input.value = root.newTodoItemTitle;
	
	input.placeholder = "Enter a TODO";
	input.autofocus = true;
	
	var button = createElement( 'button' );
	
	function clickHandler ( event ) {
		var root = this.__svelte.root;
		
		component.addNewTodo(root.newTodoItemTitle);
	}
	
	button.addEventListener( 'click', clickHandler, false );
	
	button.__svelte = {
		root: root
	};
	
	appendNode( createText( "Add TODO" ), button );
	var text3 = createText( "\r\n" );
	
	var ul = createElement( 'ul' );
	
	var eachBlock_anchor = createComment( "#each todoItems" );
	appendNode( eachBlock_anchor, ul );
	var eachBlock_value = root.todoItems;
	var eachBlock_iterations = [];
	
	for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
		eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
		eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
	}
	
	var text4 = createText( "\r\n" );
	
	var p = createElement( 'p' );
	
	appendNode( createText( "You have " ), p );
	var text6 = createText( root.undoneTodos.length );
	appendNode( text6, p );
	appendNode( createText( " uncompleted TODOs" ), p );
	input.focus();

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text1, target, anchor );
			insertNode( input, target, anchor );
			insertNode( button, target, anchor );
			insertNode( text3, target, anchor );
			insertNode( ul, target, anchor );
			insertNode( text4, target, anchor );
			insertNode( p, target, anchor );
		},
		
		update: function ( changed, root ) {
			text.data = root.listTitle;
			
			if ( !input_updating ) input.value = root.newTodoItemTitle;
			
			button.__svelte.root = root;
			
			var eachBlock_value = root.todoItems;
			
			for ( var i = 0; i < eachBlock_value.length; i += 1 ) {
				if ( !eachBlock_iterations[i] ) {
					eachBlock_iterations[i] = renderEachBlock( root, eachBlock_value, eachBlock_value[i], i, component );
					eachBlock_iterations[i].mount( eachBlock_anchor.parentNode, eachBlock_anchor );
				} else {
					eachBlock_iterations[i].update( changed, root, eachBlock_value, eachBlock_value[i], i );
				}
			}
			
			for ( var i = eachBlock_value.length; i < eachBlock_iterations.length; i += 1 ) {
				eachBlock_iterations[i].teardown( true );
			}
			
			eachBlock_iterations.length = eachBlock_value.length;
			
			text6.data = root.undoneTodos.length;
		},
		
		teardown: function ( detach ) {
			if ( component.refs.newTodo === input ) component.refs.newTodo = null;
			input.removeEventListener( 'input', inputChangeHandler, false );
			button.removeEventListener( 'click', clickHandler, false );
			
			for ( var i = 0; i < eachBlock_iterations.length; i += 1 ) {
				eachBlock_iterations[i].teardown( false );
			}
			
			if ( detach ) {
				detachNode( h1 );
				detachNode( text1 );
				detachNode( input );
				detachNode( button );
				detachNode( text3 );
				detachNode( ul );
				detachNode( text4 );
				detachNode( p );
			}
		},
	};
}

function renderEachBlock ( root, eachBlock_value, todoItem, todoItem__index, component ) {
	var li = createElement( 'li' );
	li.className = "todo-item todo-item-" + ( todoItem.done ? 'done' : 'undone' );
	
	var text = createText( todoItem.title );
	appendNode( text, li );
	
	var input = createElement( 'input' );
	input.type = "checkbox";
	
	var input_updating = false;
	
	function inputChangeHandler () {
		input_updating = true;
		var list = this.__svelte.eachBlock_value;
		var index = this.__svelte.todoItem__index;
		list[index].done = input.checked;
		
		component.set({ todoItems: component.get( 'todoItems' ) });
		input_updating = false;
	}
	
	input.addEventListener( 'change', inputChangeHandler, false );
	input.checked = todoItem.done;
	
	input.__svelte = {
		eachBlock_value: eachBlock_value,
		todoItem__index: todoItem__index
	};
	
	appendNode( input, li );
	input.focus();

	return {
		mount: function ( target, anchor ) {
			insertNode( li, target, anchor );
		},
		
		update: function ( changed, root, eachBlock_value, todoItem, todoItem__index ) {
			var todoItem = eachBlock_value[todoItem__index];
			
			li.className = "todo-item todo-item-" + ( todoItem.done ? 'done' : 'undone' );
			
			text.data = todoItem.title;
			
			if ( !input_updating ) input.checked = todoItem.done;
			
			input.__svelte.eachBlock_value = eachBlock_value;
			input.__svelte.todoItem__index = todoItem__index;
		},
		
		teardown: function ( detach ) {
			input.removeEventListener( 'change', inputChangeHandler, false );
			
			if ( detach ) {
				detachNode( li );
			}
		},
	};
}

function TodoList ( options ) {
	options = options || {};
	
	this.refs = {}
	this._state = Object.assign( template.data(), options.data );
applyComputations( this._state, this._state, {} );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root;
	this._yield = options._yield;

	this._fragment = renderMainFragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

TodoList.prototype = template.methods;

TodoList.prototype.get = function get( key ) {
 	return key ? this._state[ key ] : this._state;
 };

TodoList.prototype.fire = function fire( eventName, data ) {
 	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
 	if ( !handlers ) return;
 
 	for ( var i = 0; i < handlers.length; i += 1 ) {
 		handlers[i].call( this, data );
 	}
 };

TodoList.prototype.observe = function observe( key, callback, options ) {
 	var group = ( options && options.defer ) ? this._observers.pre : this._observers.post;
 
 	( group[ key ] || ( group[ key ] = [] ) ).push( callback );
 
 	if ( !options || options.init !== false ) {
 		callback.__calling = true;
 		callback.call( this, this._state[ key ] );
 		callback.__calling = false;
 	}
 
 	return {
 		cancel: function () {
 			var index = group[ key ].indexOf( callback );
 			if ( ~index ) group[ key ].splice( index, 1 );
 		}
 	};
 };

TodoList.prototype.on = function on( eventName, handler ) {
 	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
 	handlers.push( handler );
 
 	return {
 		cancel: function () {
 			var index = handlers.indexOf( handler );
 			if ( ~index ) handlers.splice( index, 1 );
 		}
 	};
 };

TodoList.prototype.set = function set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	applyComputations( this._state, newState, oldState )
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

TodoList.prototype.teardown = function teardown ( detach ) {
	this.fire( 'teardown' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
};

function dispatchObservers( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

		var callbacks = group[ key ];
		if ( !callbacks ) continue;

		for ( var i = 0; i < callbacks.length; i += 1 ) {
			var callback = callbacks[i];
			if ( callback.__calling ) continue;

			callback.__calling = true;
			callback.call( component, newValue, oldValue );
			callback.__calling = false;
		}
	}
}

function createElement( name ) {
	return document.createElement( name );
}

function detachNode( node ) {
	node.parentNode.removeChild( node );
}

function insertNode( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function createText( data ) {
	return document.createTextNode( data );
}

function appendNode( node, target ) {
	target.appendChild( node );
}

function createComment( data ) {
	return document.createComment( data );
}

return TodoList;

}());