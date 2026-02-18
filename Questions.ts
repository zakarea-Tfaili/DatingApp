This interview guide is designed for a Senior .NET Full Stack Developer role. Since we are in 2026, these questions reflect .NET 10 (LTS) and the latest Angular ecosystem (including the maturity of Signals).
Part 1: C#, OOP, and .NET Core (12 Questions)
1. What are "Field-backed properties" in C# 14 (.NET 10), and how do they improve code?
 * Answer: They allow you to use the field keyword in auto-properties to access the compiler-generated backing field directly. This removes the need to manually declare a private variable just to add logic (like validation or INotifyPropertyChanged) in a getter or setter.
2. Explain the 4 Pillars of OOP with a real-world Web API example.
 * Answer:
   * Encapsulation: Using private fields in a Service and exposing data via properties.
   * Abstraction: Using IOrderService to hide the logic from the Controller.
   * Inheritance: A SpecialOrder class inheriting from a base Order class.
   * Polymorphism: Overriding a CalculateTax() method to handle different regional tax laws.
3. What is the difference between an Interface and an Abstract Class? When would you use each?
 * Answer: Interfaces define a "contract" (what it does), whereas Abstract Classes provide a partial implementation (what it is). Use an interface for decoupled components (e.g., ILogger) and an abstract class when multiple classes share a common base implementation.
4. How do you handle "Diamond Problem" (Multiple Inheritance) in C#?
 * Answer: C# doesn't support multiple class inheritance. However, you can implement multiple Interfaces. If there are naming conflicts, you use "Explicit Interface Implementation."
5. What is "Native AOT" in .NET 10, and why is it significant for Microservices?
 * Answer: Native Ahead-of-Time compilation converts your code to machine code at build time. It significantly reduces startup time and memory footprint because it doesn't need the JIT compiler or the full CLR at runtime, making it perfect for serverless (AWS Lambda/Azure Functions) and containerized apps.
6. Explain the "Boxing" and "Unboxing" concepts.
 * Answer: Boxing is converting a value type (int, struct) to a reference type (object). Unboxing is the reverse. Both impact performance due to heap allocation and type checking.
7. What is the purpose of ValueTask vs Task?
 * Answer: Task is a reference type (heap allocated). ValueTask is a value type (stack allocated). Use ValueTask when a method is likely to return its result synchronously (e.g., from a cache), as it avoids unnecessary allocations.
8. How do record types differ from class types in C#?
 * Answer: Records are designed for immutable data models. They provide built-in value-based equality (comparing properties rather than memory addresses) and a concise syntax for "shallow cloning" using the with expression.
9. What are "Extension Blocks" in C# 14?
 * Answer: They allow you to group multiple extension methods, properties, and even static members into a single extension block, making the syntax cleaner than the old static class approach.
10. How does the "Managed Code" execution process work?
 * Answer: Source code is compiled into Intermediate Language (IL). At runtime, the Common Language Runtime (CLR) uses the Just-In-Time (JIT) compiler to turn IL into machine-specific code.
11. What is Dependency Injection (DI) and what are the three lifetimes in .NET Core?
 * Answer: DI is a pattern for achieving Inversion of Control. Lifetimes:
   * Transient: Created every time they are requested.
   * Scoped: Created once per client request (connection).
   * Singleton: Created once and shared globally.
12. Explain "Yield Return" and how it helps with memory management.
 * Answer: It allows for "deferred execution." Instead of creating and returning an entire list in memory, it returns one item at a time as the caller iterates through the collection.
Part 2: Multitasking, Tasks, and Concurrency (5 Questions)
13. What is the difference between Task.Run() and Task.Factory.StartNew()?
 * Answer: Task.Run is a shorthand for StartNew with default settings (most common). StartNew offers more granular control, like specifying LongRunning or parent-child task relationships.
14. How do you handle exceptions in an async method returning void vs Task?
 * Answer: Exceptions in async Task can be caught with a try-catch around the awaiter. Exceptions in async void cannot be caught by the caller and usually crash the process (unless handled in a global synchronization context). Avoid async void except for event handlers.
15. What is SemaphoreSlim and when would you use it?
 * Answer: It’s a lightweight synchronization primitive used to limit the number of threads that can access a resource concurrently (e.g., limiting a Web API to only 5 concurrent calls to a third-party legacy service).
16. Explain the concept of "Deadlock" and how to avoid it in C#?
 * Answer: A deadlock occurs when two tasks wait for each other to release a resource. Avoid it by using await instead of .Result or .Wait(), and by consistently acquiring locks in the same order.
17. What is Parallel.ForEach vs foreach with async/await?
 * Answer: Parallel.ForEach is for CPU-bound tasks (it blocks the calling thread). async/await is for I/O-bound tasks (it frees the thread while waiting for the response).
Part 3: Entity Framework Core (EF Core) (5 Questions)
18. What are "Shadow Properties" in EF Core?
 * Answer: Properties that are not defined in your C# class but exist in the database and are managed by the EF Core Change Tracker (e.g., LastUpdatedDate).
19. Compare "Eager Loading," "Lazy Loading," and "Explicit Loading."
 * Answer:
   * Eager: Uses .Include() to fetch related data in one query.
   * Lazy: Related data is loaded only when accessed (requires proxies).
   * Explicit: Manually loading related data via .Entry(...).Collection(...).Load().
20. What is the "N+1 Problem" and how do you solve it?
 * Answer: It happens when you query a parent list and then execute a separate query for each child. Solve it by using Eager Loading (.Include()) or projecting into a DTO.
21. How do you implement "Global Query Filters" in EF Core?
 * Answer: You define them in OnModelCreating using HasQueryFilter(). This is commonly used for Multi-tenancy or Soft Delete (e.g., builder.Entity<Post>().HasQueryFilter(p => !p.IsDeleted)).
22. What is "No-Tracking" query and when should you use it?
 * Answer: .AsNoTracking() tells EF Core not to track changes to the returned entities. Use it for read-only scenarios to save memory and improve performance.
Part 4: Design Patterns & Logging (5 Questions)
23. Explain the Repository and Unit of Work patterns.
 * Answer: Repository abstracts the data access logic. Unit of Work ensures that multiple repository operations are treated as a single transaction (all succeed or all fail).
24. What is the Strategy Pattern? Give an API example.
 * Answer: It allows switching algorithms at runtime. Example: An API that calculates shipping costs differently based on the provider (FedEx, UPS, DHL) without changing the main controller logic.
25. What is the difference between "Structured Logging" and "Plain Text Logging"?
 * Answer: Structured logging (like Serilog) saves logs as JSON/Objects. This allows you to query logs by specific fields (e.g., "Find all logs where UserId == 123") rather than doing slow string searches.
26. How do you implement Distributed Tracing in .NET?
 * Answer: By using OpenTelemetry. It allows you to track a single request as it moves through multiple microservices by attaching a "Trace ID" to the headers.
27. What is the CQRS pattern?
 * Answer: Command Query Responsibility Segregation. It separates read operations (Queries) from write operations (Commands), often using different models or even different databases for each to maximize performance and scalability.
Part 5: SQL Server (6 Questions)
28. What is the difference between a Clustered and a Non-Clustered index?
 * Answer: A Clustered index determines the physical order of data in the table (only one allowed, usually the Primary Key). A Non-Clustered index is a separate structure that points to the data (like an index in the back of a book).
29. Explain the different types of Joins.
 * Answer:
   * Inner Join: Matches in both tables.
   * Left Join: All from left table + matches from right.
   * Full Join: All records when there is a match in either table.
   * Cross Join: Cartesian product (every row with every other row).
30. Stored Procedure vs. Function: What are the main differences?
 * Answer: Functions must return a value, cannot change database state (read-only), and can be used in a SELECT statement. Stored Procedures can return multiple values, change data (INSERT/UPDATE), and handle transactions.
31. What is a "Deadlock" in SQL and how can you minimize it?
 * Answer: When two sessions block each other by holding locks the other needs. Minimize by keeping transactions short, accessing tables in a consistent order, and using appropriate isolation levels like READ COMMITTED SNAPSHOT.
32. What is the difference between WHERE and HAVING?
 * Answer: WHERE filters rows before they are grouped. HAVING filters the results after the GROUP BY clause is applied.
33. What is "Database Normalization" (up to 3NF)?
 * Answer:
   * 1NF: Atomic values (no arrays/repeating groups).
   * 2NF: 1NF + no partial dependencies (every column depends on the whole primary key).
   * 3NF: 2NF + no transitive dependencies (columns only depend on the primary key, not on other columns).
Part 6: Angular & Frontend (7 Questions)
34. What are the benefits of a Single Page Application (SPA)?
 * Answer: Better user experience (no full page reloads), faster transitions, reduced server load (server only sends data, not HTML), and clear separation of concerns between API and UI.
35. Why choose Angular over React or Vue for an enterprise project?
 * Answer: Angular is an "opinionated" framework. It provides a built-in architecture (Modules, DI, Routing, Forms, HTTP Client), which ensures consistency across large teams and long-term maintainability.
36. What are Angular Signals and why are they better than RxJS for state management?
 * Answer: Signals provide a fine-grained reactivity model. Unlike RxJS, which requires manual subscriptions/unsubscriptions and triggers "Zone.js" change detection for the whole tree, Signals allow Angular to know exactly which part of the UI needs to update, leading to better performance and simpler code.
37. Explain "Standalone Components" (introduced in Angular 14+).
 * Answer: They allow you to create components without the need for an @NgModule. This reduces boilerplate, simplifies the mental model, and makes lazy loading of individual components easier.
38. What styling libraries are common in Angular, and what is "View Encapsulation"?
 * Answer: Common: Tailwind CSS, Angular Material, Bootstrap. View Encapsulation (Emulated, ShadowDom, None) defines how CSS styles are scoped to a component so they don't leak out and affect the rest of the app.
39. What is "Change Detection" in Angular?
 * Answer: It's the mechanism that syncs the Component's data with the HTML View. Default checks the whole tree; OnPush only checks if an @Input reference changes or an event is triggered, improving performance.
40. How do you handle authentication in an Angular app?
 * Answer: Usually by using an HttpInterceptor to attach a JWT token to every outgoing request and Route Guards (CanActivate) to prevent unauthorized users from accessing certain pages.
Would you like me to create a coding challenge or a practical scenario based on these topics to test their problem-solving skills?
