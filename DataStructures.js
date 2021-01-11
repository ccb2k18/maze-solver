class Container {

	constructor(element, name) {

		this.element = element;
		this.name = name;
	}
}

class HashTable {

	constructor(size) {

		this.table = new Array(size).fill(null);
		this.size = size;
	}
	static #generateHashCode(string) {

		let hashCode = 0;
		let char = 0;
		for (let i = 0; i < string.length; i++) {

			hashCode += ((i*char) + 7)*string.charCodeAt(i);
			char = i - 1;
		}
		return hashCode % this.size;
	}
	setElementAt(keyString, element) {

		var index = HashTable.#generateHashCode(keyString);
		if (this.table[index] == null) {

			this.table[index] = new Array();
		}
		this.table[index].push(new Container(element, keyString));
	}

	getElementAt(keyString) {

		var index = HashTable.#generateHashCode(keyString);
		var lst = this.table[index];
		if (lst == null) { return null; }
		for (let i = 0; i < lst.length; i++) {

			if (lst[i].name == keyString) {

				return lst[i].element;
			}
		}
		return null;
	}

	deleteElementAt(keyString) {

		var index = HashTable.#generateHashCode(keyString);
		var lst = this.table[index];
		if (lst == null) { return null; }
		for (let i = 0; i < lst.length; i++) {

			if (lst[i].name == keyString) {

				delete lst[i];
				return;
			}
		}

	}

}