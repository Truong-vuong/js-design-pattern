//1. Singletons
/*chúng ta sử dụng singleton pattern để hạn chế khởi tạo đối tượng, giảm bớt được khai báo đối tượng dư thừa, 
chỉ khởi tạo một lần duy nhất và có thể truy cập toàn cục*/
let instance;
let counter = 0;
class Counter1 {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
  }

  getInstance() {
    return this;
  }

  getCount() {
    return counter;
  }

  increment() {
    return ++counter;
  }

  decrement() {
    return --counter;
  }
}
const counter1 = new Counter1();
// const counter2 = new Counter1();
// console.log(counter2)
// const singletonCounter = Object.freeze(new Counter());
// export default singletonCounter;

const utils = (() => {
  let instance;
  function init() {
    return {
      sum: function () {
        let nums = Array.prototype.slice.call(arguments);
        return nums.reduce((numb, total) => numb + total, 0);
      },
    };
  }

  return {
    getInstance: function () {
      // Nếu đối tượng này chưa được khởi tạo
      if (!instance) {
        // Khởi tạo lần đầu tiên
        instance = new init();
      }
      // Không khởi tạo nữa, chỉ trả về đối tượng đã khởi tạo
      return instance;
    },
  };
})();
const firstU = utils.getInstance(); // Cùng lấy 1 instance
const secondU = utils.getInstance(); // Cùng lấy 1 instance
// console.log(firstU === secondU); // Trả về true là đúng vì cùng thuộc 1 instance duy nhất
// console.log(firstU.sum(1,2,3,4,5)) // 15 // working

// 2. Modules Pattern
/*Module pattern là design pattern được sinh ra để triển khai khái niệm modules software. 
Đây là một design pattern sinh ra để tuân thủ tính bao đóng như các ngôn ngữ lập trình OOP (Các đối tượng class luôn có tính bao đóng, 
để tránh các truy cập, chỉnh sửa trái phép). Modules Pattern cho phép bạn chia mã của mình thành các phần nhỏ hơn, có thể tái sử dụng.*/
const person = (() => {
  let name = "Codestus";
  let age = 20;

  return {
    getName: () => {
      return name;
    },

    getAge: () => {
      return age;
    },

    setName: (_name) => (name = _name),
    setAge: (_age) => (name = _age),
  };
})();
// console.log(person.setAge(16))
/*Như đoạn mã phía trên, bạn chỉ có thẻ truy cập get hoặc set thông qua các phương thức đã được cung cấp trong @return 
chứ không được quyền truy cập vào biến chỉnh sửa. */

import add, { multiply, subtract, square } from "./math.js";
multiply(8, 9);
subtract(10, 3);
square(3);
// console.log(add(7, 8));

// Dynamic import for performance
const button = document.getElementById("btnGetMath");
button.addEventListener("click", () => {
  import("./math.js").then((module) => {
    console.log("Add: ", module.default(1, 2));
    console.log("Multiply: ", module.multiply(3, 2));
  });
});

// 3. Revealing Module Pattern
/*Revealing Module Pattern là một thiết kế phổ biến trong lập trình JavaScript 
để giảm thiểu sự xung đột và gây rối trong việc quản lý các biến và phương thức trong các module (đơn vị mã) của ứng dụng. 
Nó là một biến thể của Module Pattern, 
một kỹ thuật sử dụng closures (đóng gói hàm) để tạo ra các "private" và "public" scope cho các thành phần của module. */

// so sánh sự khác biệt của module pattern và revealing module pattern
const Module = (function () {
  // Private variable
  let privateCounter = 0;

  // Private function
  function privateIncrement() {
    privateCounter++;
  }

  // Public interface
  return {
    increment: function () {
      privateIncrement();
    },
    getCounter: function () {
      return privateCounter;
    },
  };
})();
console.log("m", Module);
// console.log(Module.getCounter()); // Output: 0 (initial value)
// Module.increment();
// console.log(Module.getCounter()); // Output: 1

const RevealingModule = (function () {
  // Private variable
  let privateCounter = 0;

  // Private function
  function privateIncrement() {
    privateCounter++;
  }

  // Public function - được tiết lộ
  function increment() {
    privateIncrement();
  }

  // Public function - được tiết lộ
  function getCounter() {
    return privateCounter;
  }

  // Tiết lộ các thành viên công khai bằng cách trả về một đối tượng
  return {
    increment: increment,
    getCounter: getCounter,
  };
})();
console.log("rm", RevealingModule);
//   console.log(RevealingModule.getCounter()); // Output: 0 (initial value)
//   RevealingModule.increment();
//   console.log(RevealingModule.getCounter()); // Output: 1

// 4. Observer Partern
// Đầu tiên, chúng ta tạo một đối tượng Subject:
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(product) {
    this.observers.forEach((observer) => observer.update(product));
  }
};

// Tiếp theo, chúng ta tạo các đối tượng là các "người quan sát" (observers) muốn nhận thông báo khi có sản phẩm mới:
class User {
  constructor(name) {
    this.name = name;
  }

  update(product) {
    console.log(
      `${this.name} recive notify "${product}" add to store.`
    );
  }
};

// Tiếp theo, chúng ta tạo một đối tượng cửa hàng (Subject) và thêm các người quan sát (observers) vào danh sách:
const onlineStore = new Subject();

const user1 = new User("Vuong");
const user2 = new User("Quy");
const user3 = new User("Phu");

onlineStore.addObserver(user1);
onlineStore.addObserver(user2);
onlineStore.addObserver(user3);
onlineStore.removeObserver(user2);

// Khi có sản phẩm mới được thêm vào cửa hàng, cửa hàng sẽ thông báo cho tất cả người quan sát (observers):
const newProduct = "Lemon Fruit";
onlineStore.notifyObservers(newProduct);


// 5. Prototype Design Pattern
// Tạo hàm constructor cho đối tượng Person
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Thêm phương thức getInfo vào prototype của Person
Person.prototype.getInfo = function() {
  return `Tên: ${this.name}, Tuổi: ${this.age}`;
};

// Tạo đối tượng person1 từ hàm constructor Person
const person1 = new Person("John", 30);

// Tạo đối tượng person2 từ hàm constructor Person
const person2 = new Person("Alice", 25);

// Sử dụng phương thức getInfo từ prototype để lấy thông tin của các đối tượng
console.log(person1.getInfo()); // Kết quả: "Tên: John, Tuổi: 30"
console.log(person2.getInfo()); // Kết quả: "Tên: Alice, Tuổi: 25"


// 6. Factory Pattern
/**Factory Pattern là một mẫu thiết kế giúp tạo ra các đối tượng một cách linh hoạt bằng cách sử dụng một hàm tạo (factory function) thay vì trực tiếp gọi từ khóa "new". 
 * Điều này cho phép chúng ta trừu tượng hóa quá trình tạo đối tượng và giúp dễ dàng mở rộng và duy trì mã. */
// Định nghĩa hàm Factory
function ShapeFactory() {}

// Thêm phương thức tạo đối tượng hình học
ShapeFactory.prototype.createShape = function(type) {
  if (type === 'circle') {
    return new Circle();
  } else if (type === 'square') {
    return new Square();
  } else if (type === 'triangle') {
    return new Triangle();
  } else {
    throw new Error('Invalid shape type.');
  }
};
//Định nghĩa các lớp hình học:
// Lớp hình tròn
function Circle() {
  this.type = 'circle';
  this.draw = function() {
    return "Vẽ hình tròn";
  };
}

// Lớp hình vuông
function Square() {
  this.type = 'square';
  this.draw = function() {
    return "Vẽ hình vuông";
  };
}

// Lớp hình tam giác
function Triangle() {
  this.type = 'triangle';
  this.draw = function() {
    return "Vẽ hình tam giác";
  };
}
//Sử dụng Factory Pattern để tạo các đối tượng hình học:
const factory = new ShapeFactory();

const circle = factory.createShape('circle');
console.log(circle.draw()); // Kết quả: "Vẽ hình tròn"

const square = factory.createShape('square');
console.log(square.draw()); // Kết quả: "Vẽ hình vuông"

const triangle = factory.createShape('triangle');
console.log(triangle.draw()); // Kết quả: "Vẽ hình tam giác"


// 7. Decorator Pattern
/** Decorator Pattern là một mẫu thiết kế (design pattern) cho phép bạn mở rộng hoặc thêm chức năng cho các đối tượng mà không cần thay đổi cấu trúc của chúng. 
 * Điều này giúp bạn tái sử dụng mã và tách riêng các chức năng riêng biệt để dễ dàng quản lý. */
// Đối tượng Shape (Hình dạng) cơ bản
class Shape {
  draw() {
    return "Vẽ hình dạng cơ bản.";
  }
}

// Decorator (Trang trí) để thêm màu sắc cho hình dạng
class ColorDecorator {
  constructor(shape, color) {
    this.shape = shape;
    this.color = color;
  }

  draw() {
    return this.shape.draw() + ` Màu sắc: ${this.color}.`;
  }
}

// Decorator (Trang trí) để thêm viền cho hình dạng
class BorderDecorator {
  constructor(shape, borderType) {
    this.shape = shape;
    this.borderType = borderType;
  }

  draw() {
    return this.shape.draw() + ` Viền: ${this.borderType}.`;
  }
}

// Tạo một hình dạng cơ bản
const basicShape = new Shape();

// Trang trí hình dạng cơ bản với màu sắc và viền
const coloredAndBorderedShape = new BorderDecorator(
  new ColorDecorator(basicShape, "đỏ"),
  "đậm"
);

// Khi vẽ hình dạng đã được trang trí
console.log(coloredAndBorderedShape.draw());
