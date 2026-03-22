import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Clock, CheckCircle2, X, Loader2, Trophy, ChevronRight, AlertTriangle, BookOpen, List, Shuffle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ════════════════════════════════════════════════════════════════════════════
   CHAPTER BANKS — Each subject → chapters → questions
   ════════════════════════════════════════════════════════════════════════════ */
const SUBJECTS = [
  {
    id: 'dsa', name: 'DSA', emoji: '🧮', color: '#3b82f6',
    chapters: [
      {
        id: 'arrays', name: 'Arrays & Strings',
        questions: [
          { q: "What is the time complexity of accessing an element in an array by index?", opts: ["O(log n)","O(n)","O(1)","O(n²)"], ans: 2 },
          { q: "Which algorithm finds the maximum subarray sum in O(n)?", opts: ["Divide & Conquer","Kadane's Algorithm","Binary Search","Merge Sort"], ans: 1 },
          { q: "In Two-Pointer technique, what kind of array is usually required?", opts: ["Unsorted","Sorted","Random","Circular"], ans: 1 },
          { q: "How many swaps does Bubble Sort make in the best case (already sorted)?", opts: ["n-1","0","n/2","n log n"], ans: 1 },
          { q: "What does 'amortized O(1)' mean for dynamic array push?", opts: ["Every push is O(1)","Average O(1) across many operations","Memory is always constant","No resizing ever happens"], ans: 1 },
          { q: "Given array [1,2,3,4,5], after reversing it becomes?", opts: ["[5,4,3,2,1]","[1,2,3,4,5]","[2,3,4,5,1]","[5,1,2,3,4]"], ans: 0 },
          { q: "Anagram check between two strings most efficiently uses?", opts: ["Sorting both strings","Frequency map / HashMap","Two pointer","Both A and B"], ans: 3 },
          { q: "Sliding Window technique CANNOT directly solve which problem?", opts: ["Max sum subarray of size k","Longest substring without repeating chars","Longest increasing subsequence","Smallest window containing all chars"], ans: 2 },
        ],
      },
      {
        id: 'trees', name: 'Trees & Graphs',
        questions: [
          { q: "What data structure is used in Breadth-First Search (BFS)?", opts: ["Stack","Priority Queue","Queue","Heap"], ans: 2 },
          { q: "Height of a balanced BST with n nodes is?", opts: ["O(n)","O(log n)","O(n²)","O(1)"], ans: 1 },
          { q: "Which traversal of BST gives sorted order?", opts: ["Preorder","Postorder","Inorder","Level-order"], ans: 2 },
          { q: "Dijkstra's algorithm uses which data structure for efficiency?", opts: ["Stack","Queue","Min-Heap / Priority Queue","Hash Map"], ans: 2 },
          { q: "In a binary tree, the maximum number of nodes at level L is?", opts: ["L","2^L","L²","2L"], ans: 1 },
          { q: "Which graph algorithm detects negative cycles?", opts: ["Dijkstra","Prim's","Bellman-Ford","Kruskal's"], ans: 2 },
          { q: "Topological sort is only possible for?", opts: ["Undirected graphs","Cyclic graphs","Directed Acyclic Graphs (DAG)","Complete graphs"], ans: 2 },
          { q: "Space complexity of DFS on a graph with V vertices and E edges?", opts: ["O(V+E)","O(V)","O(E)","O(log V)"], ans: 1 },
        ],
      },
      {
        id: 'sorting', name: 'Sorting & Searching',
        questions: [
          { q: "Which sorting algorithm has worst-case O(n²)?", opts: ["Merge Sort","Heap Sort","Quick Sort","Tim Sort"], ans: 2 },
          { q: "Which sorting algorithm is stable AND O(n log n) worst-case?", opts: ["QuickSort","HeapSort","MergeSort","BubbleSort"], ans: 2 },
          { q: "Space complexity of Merge Sort?", opts: ["O(1)","O(log n)","O(n)","O(n²)"], ans: 2 },
          { q: "Binary search on 100 elements: max number of comparisons?", opts: ["100","50","7","10"], ans: 2 },
          { q: "Which of these is NOT an in-place sorting algorithm?", opts: ["Bubble Sort","Heap Sort","Merge Sort","Insertion Sort"], ans: 2 },
          { q: "Finding duplicate in array of n+1 numbers from [1..n] without extra space uses?", opts: ["Sorting","Floyd's cycle detection","Two pointers","Hashing"], ans: 1 },
          { q: "Which sort is best for nearly-sorted arrays?", opts: ["Quick Sort","Heap Sort","Insertion Sort","Shell Sort"], ans: 2 },
          { q: "Counting Sort works efficiently when?", opts: ["Array is mostly sorted","Elements are strings","Range of elements is small (k << n)","Array has many duplicates"], ans: 2 },
        ],
      },
      {
        id: 'dp', name: 'Dynamic Programming',
        questions: [
          { q: "DP solves problems by exploiting?", opts: ["Greedy choice","Overlapping subproblems & optimal substructure","Divide and conquer only","Random sampling"], ans: 1 },
          { q: "Which is NOT a classic DP problem?", opts: ["0/1 Knapsack","Longest Common Subsequence","Binary Search","Edit Distance"], ans: 2 },
          { q: "Memoization is which DP approach?", opts: ["Bottom-up","Top-down","Both","Neither"], ans: 1 },
          { q: "Coin Change problem asks for?", opts: ["Max coins in a row","Min coins to make amount","All possible coin combinations","Max value with weight limit"], ans: 1 },
          { q: "LCS of 'ABCBDAB' and 'BDCAB' is?", opts: ["3","4","5","6"], ans: 1 },
          { q: "Fibonacci with memoization has time complexity?", opts: ["O(2^n)","O(n²)","O(n)","O(log n)"], ans: 2 },
          { q: "Matrix Chain Multiplication seeks to?", opts: ["Find max element","Minimize scalar multiplications","Sort matrix rows","Invert matrix"], ans: 1 },
          { q: "Tabulation (bottom-up DP) starts solving from?", opts: ["The final answer","The smallest subproblems","A random subproblem","The middle"], ans: 1 },
        ],
      },
    ],
  },
  {
    id: 'gate', name: 'GATE CS', emoji: '🎓', color: '#ef4444',
    chapters: [
      {
        id: 'os', name: 'Operating Systems',
        questions: [
          { q: "Which scheduling algorithm may cause starvation?", opts: ["Round Robin","FCFS","Priority Scheduling","SJF (non-preemptive)"], ans: 2 },
          { q: "Deadlock can be prevented by ensuring which condition NEVER holds?", opts: ["Mutual Exclusion","Hold and Wait","No Preemption","All of the above"], ans: 3 },
          { q: "What is Thrashing in OS?", opts: ["Too many processes in ready queue","CPU spending more time swapping pages than executing","Memory overflow error","Disk failure"], ans: 1 },
          { q: "OPTIMAL page replacement theoretically has?", opts: ["Highest page faults","Lowest page faults","Same as LRU","Same as FIFO"], ans: 1 },
          { q: "In TCP, which flag initiates a connection?", opts: ["ACK","FIN","SYN","RST"], ans: 2 },
          { q: "Semaphores are used to solve?", opts: ["Deadlock only","Critical section / synchronization problems","Memory fragmentation","CPU scheduling"], ans: 1 },
          { q: "Virtual memory allows?", opts: ["Programs larger than physical RAM to run","Faster CPU execution","Multiple CPUs","Encrypted memory"], ans: 0 },
          { q: "Context switching overhead is associated with?", opts: ["Higher throughput","Lower latency","Extra time to save/restore process state","Better security"], ans: 2 },
        ],
      },
      {
        id: 'dbms', name: 'DBMS & SQL',
        questions: [
          { q: "Which normal form eliminates partial dependencies?", opts: ["1NF","2NF","3NF","BCNF"], ans: 1 },
          { q: "BCNF is stricter than 3NF because?", opts: ["It eliminates all anomalies","Every determinant must be a candidate key","It allows transitive dependencies","It normalizes to 4NF automatically"], ans: 1 },
          { q: "A B-tree of order m has at most how many keys per node?", opts: ["m","m-1","m+1","2m"], ans: 1 },
          { q: "Which SQL clause filters GROUPS (after GROUP BY)?", opts: ["WHERE","HAVING","ORDER BY","DISTINCT"], ans: 1 },
          { q: "Which JOIN returns all rows from both tables?", opts: ["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"], ans: 3 },
          { q: "Atomicity in ACID means?", opts: ["All or nothing — transaction fully completes or fully rolls back","Data is consistent after transaction","Multiple users can read simultaneously","Changes are permanent"], ans: 0 },
          { q: "Primary key difference from Unique key?", opts: ["Primary key allows NULLs","Unique key cannot be composite","Primary key cannot have NULLs, unique key can have one NULL","No difference"], ans: 2 },
          { q: "Which is a DDL command?", opts: ["SELECT","INSERT","CREATE","UPDATE"], ans: 2 },
        ],
      },
      {
        id: 'networks', name: 'Computer Networks',
        questions: [
          { q: "Which layer of OSI model handles routing?", opts: ["Data Link","Transport","Network","Session"], ans: 2 },
          { q: "TCP is different from UDP because TCP provides?", opts: ["Faster transmission","Connectionless service","Reliable, ordered delivery","Broadcast support"], ans: 2 },
          { q: "IP address 192.168.0.1 belongs to which class?", opts: ["Class A","Class B","Class C","Class D"], ans: 2 },
          { q: "DNS converts?", opts: ["IP to MAC","Domain name to IP address","Port to IP","HTTP to HTTPS"], ans: 1 },
          { q: "Which protocol is used to assign IP addresses dynamically?", opts: ["DNS","FTP","DHCP","ARP"], ans: 2 },
          { q: "The sliding window protocol improves?", opts: ["Security","Throughput utilization","Error detection","Routing"], ans: 1 },
          { q: "HTTP runs on which port by default?", opts: ["21","23","80","443"], ans: 2 },
          { q: "MAC address operates at which OSI layer?", opts: ["Network","Transport","Data Link","Physical"], ans: 2 },
        ],
      },
      {
        id: 'toc', name: 'Theory of Computation',
        questions: [
          { q: "Which of the following is NOT a context-free language?", opts: ["{ aⁿbⁿ | n≥1}","{ aⁿbⁿcⁿ | n≥1}","{ ww^R | w∈{a,b}*}","Palindromes over {a,b}"], ans: 1 },
          { q: "A DFA has?", opts: ["Non-deterministic transitions","Exactly one transition per symbol per state","ε-transitions","Multiple start states"], ans: 1 },
          { q: "Context-free grammars generate?", opts: ["Regular languages only","Context-free languages","Context-sensitive languages","Recursively enumerable languages"], ans: 1 },
          { q: "P = NP is expected to be false. Which is NP-Complete?", opts: ["Sorting","Binary Search","SAT (Boolean Satisfiability)","Shortest Path"], ans: 2 },
          { q: "Pumping Lemma is used to prove?", opts: ["A language is regular","A language is NOT regular","Equivalence of DFA and NFA","NFA has more power than DFA"], ans: 1 },
          { q: "Halting problem is?", opts: ["Decidable","Semi-decidable","Undecidable","Polynomial time solvable"], ans: 2 },
          { q: "Regular expressions can describe which type of languages?", opts: ["Type 0","Type 1","Type 2","Type 3 (Regular)"], ans: 3 },
          { q: "Every NFA can be converted to an equivalent?", opts: ["PDA","Turing Machine","DFA","Context-free grammar"], ans: 2 },
        ],
      },
    ],
  },
  {
    id: 'upsc', name: 'UPSC / Polity', emoji: '🏛️', color: '#f97316',
    chapters: [
      {
        id: 'polity', name: 'Indian Polity',
        questions: [
          { q: "Which Article abolishes untouchability?", opts: ["Article 14","Article 17","Article 21","Article 25"], ans: 1 },
          { q: "Who presides over the joint sitting of Parliament?", opts: ["President","Speaker of Lok Sabha","Chairman of Rajya Sabha","Prime Minister"], ans: 1 },
          { q: "The Parliament of India consists of?", opts: ["Lok Sabha only","Rajya Sabha and Lok Sabha","President, Rajya Sabha and Lok Sabha","PM, President and Lok Sabha"], ans: 2 },
          { q: "Which schedule deals with allocation of seats in Rajya Sabha?", opts: ["Third","Fourth","Fifth","Sixth"], ans: 1 },
          { q: "Article 356 relates to?", opts: ["Freedom of speech","President's Rule in states","Right to Education","Formation of new states"], ans: 1 },
          { q: "Chief Election Commissioner cannot be removed except by?", opts: ["Presidential order","Supreme Court order","Impeachment like a High Court judge","Recommendation of PM"], ans: 2 },
          { q: "Directive Principles of State Policy are?", opts: ["Justiciable in court","Non-justiciable but fundamental to governance","Part of Fundamental Rights","Enforceable by High Courts"], ans: 1 },
          { q: "Which Fundamental Right cannot be suspended even during Emergency?", opts: ["Freedom of speech","Right to equality","Right to life and personal liberty (Article 21)","Right to religion"], ans: 2 },
        ],
      },
      {
        id: 'history', name: 'Modern History',
        questions: [
          { q: "Battle of Plassey was fought in?", opts: ["1757","1761","1764","1775"], ans: 0 },
          { q: "Who founded the Indian National Congress in 1885?", opts: ["Bal Gangadhar Tilak","A.O. Hume","Dadabhai Naoroji","Gopal Krishna Gokhale"], ans: 1 },
          { q: "The 'Quit India Movement' was launched in?", opts: ["1940","1942","1944","1945"], ans: 1 },
          { q: "Partition of Bengal (1905) was reversed in?", opts: ["1909","1911","1919","1921"], ans: 1 },
          { q: "Who gave the slogan 'Swaraj is my birthright'?", opts: ["Gandhi","Nehru","Tilak","Bose"], ans: 2 },
          { q: "Jallianwala Bagh massacre occurred in?", opts: ["1915","1917","1919","1921"], ans: 2 },
          { q: "The Dandi March was to protest against?", opts: ["Partition of India","Salt tax","Press restrictions","Rowlatt Act"], ans: 1 },
          { q: "First War of Indian Independence (Sepoy Mutiny) was in?", opts: ["1845","1857","1867","1905"], ans: 1 },
        ],
      },
      {
        id: 'geography', name: 'Indian Geography',
        questions: [
          { q: "The Tropic of Cancer passes through how many Indian states?", opts: ["6","7","8","9"], ans: 2 },
          { q: "Which river is called the 'Sorrow of Bihar'?", opts: ["Son","Kosi","Gandak","Ghaghra"], ans: 1 },
          { q: "Largest producer of mica in India?", opts: ["Rajasthan","Jharkhand","Andhra Pradesh","Karnataka"], ans: 1 },
          { q: "The Western Ghats are also called?", opts: ["Sahyadri","Vindhyas","Aravalli","Satpura"], ans: 0 },
          { q: "Which state has the longest coastline in India?", opts: ["Maharashtra","Tamil Nadu","Andhra Pradesh","Gujarat"], ans: 3 },
          { q: "Sundarbans is located in which state?", opts: ["Odisha","West Bengal","Assam","Andhra Pradesh"], ans: 1 },
          { q: "Highest peak in India?", opts: ["Mount Everest","K2","Kanchenjunga","Nanda Devi"], ans: 2 },
          { q: "Which ocean surrounds the Andaman and Nicobar Islands?", opts: ["Arabian Sea","Bay of Bengal","Indian Ocean","Pacific Ocean"], ans: 1 },
        ],
      },
    ],
  },
  {
    id: 'ssc', name: 'SSC CGL', emoji: '📋', color: '#06b6d4',
    chapters: [
      {
        id: 'quant', name: 'Quantitative Aptitude',
        questions: [
          { q: "A train 200m long passes a pole in 10 seconds. Speed = ?", opts: ["10 m/s","20 m/s","15 m/s","25 m/s"], ans: 1 },
          { q: "If 15 men can do a work in 20 days, how many men to do it in 12 days?", opts: ["20","22","25","30"], ans: 2 },
          { q: "Simple interest on ₹8000 at 10% per annum for 2 years?", opts: ["₹1200","₹1400","₹1600","₹1800"], ans: 2 },
          { q: "If A:B = 2:3 and B:C = 4:5, then A:B:C = ?", opts: ["8:12:15","4:6:5","2:3:5","8:6:15"], ans: 0 },
          { q: "15% of 240 = ?", opts: ["32","36","40","42"], ans: 1 },
          { q: "Shopkeeper sells TV at 20% profit. CP = ₹15000, SP = ?", opts: ["₹17000","₹17500","₹18000","₹18500"], ans: 2 },
          { q: "Find next term: 2, 6, 12, 20, 30, ?", opts: ["40","42","44","46"], ans: 1 },
          { q: "A can complete work in 18 days, B in 12 days. Together in how many days?", opts: ["6.5","7.2","8","9"], ans: 1 },
        ],
      },
      {
        id: 'english', name: 'English Language',
        questions: [
          { q: "Choose the correctly spelt word:", opts: ["Accomodation","Accommodation","Acommodation","Accommodtion"], ans: 1 },
          { q: "The synonym of 'Benevolent' is:", opts: ["Cruel","Malicious","Kind","Fierce"], ans: 2 },
          { q: "The antonym of 'Verbose' is:", opts: ["Talkative","Garrulous","Brief","Fluent"], ans: 2 },
          { q: "Select the correct form: He _____ there since morning.", opts: ["is","was","has been","have been"], ans: 2 },
          { q: "Idiom 'Bite the bullet' means?", opts: ["Act cowardly","Endure pain bravely","Start a fight","Eat quickly"], ans: 1 },
          { q: "Active: 'She writes a letter.' Passive form:", opts: ["A letter is being written by her","A letter was written by her","A letter is written by her","A letter had been written by her"], ans: 2 },
          { q: "Choose the correct sentence:", opts: ["She don't know me.","She doesn't knows me.","She doesn't know me.","She do not knows me."], ans: 2 },
          { q: "'Ephemeral' means:", opts: ["Permanent","Short-lived","Bright","Mysterious"], ans: 1 },
        ],
      },
      {
        id: 'reasoning', name: 'Logical Reasoning',
        questions: [
          { q: "Select the odd one out: Mango, Guava, Papaya, Potato", opts: ["Mango","Guava","Papaya","Potato"], ans: 3 },
          { q: "Books are to Library as Paintings are to?", opts: ["Museum","School","Gallery","Garden"], ans: 2 },
          { q: "If WATER = 25 and FIRE = 16, then AIR = ?", opts: ["9","12","15","18"], ans: 0 },
          { q: "Sequence: 1, 4, 9, 16, 25, __?", opts: ["30","36","40","49"], ans: 1 },
          { q: "If A = 1, B = 2... Z = 26, then CAB = ?", opts: ["5","6","7","8"], ans: 1 },
          { q: "In a row of students, Ravi is 7th from left and 13th from right. Total students?", opts: ["18","19","20","21"], ans: 1 },
          { q: "All cats are dogs. All dogs are birds. Therefore?", opts: ["All birds are cats","All cats are birds","Some cats are birds","No cats are birds"], ans: 1 },
          { q: "Pointing to a woman, Akash says 'Her mother is the only daughter of my mother.' How is she related to Akash?", opts: ["Sister","Niece","Daughter","Mother"], ans: 2 },
        ],
      },
    ],
  },
  {
    id: 'oops', name: 'OOPs', emoji: '🏗️', color: '#a855f7',
    chapters: [
      {
        id: 'java', name: 'Java OOP Concepts',
        questions: [
          { q: "Which keyword prevents a class from being subclassed in Java?", opts: ["static","abstract","final","private"], ans: 2 },
          { q: "What is method overloading?", opts: ["Same method name, different return type only","Same name, different parameters in same class","Redefining parent method in child class","Hiding parent class fields"], ans: 1 },
          { q: "What does the 'super' keyword do in Java?", opts: ["Calls grandparent method","Refers to parent class constructor or method","Creates a new object","Accesses static members"], ans: 1 },
          { q: "In Java, all classes implicitly extend which class?", opts: ["Base","Object","Root","Primitive"], ans: 1 },
          { q: "Which access modifier makes member visible only within its package?", opts: ["private","public","protected","default (no modifier)"], ans: 3 },
          { q: "Multiple inheritance in Java is supported through?", opts: ["Classes","Abstract Classes","Interfaces","Enum"], ans: 2 },
          { q: "Constructor is different from a method because?", opts: ["Constructor has return type","Constructor name matches class name","Constructor is static","Constructor cannot throw exceptions"], ans: 1 },
          { q: "Encapsulation is best achieved by?", opts: ["Making all fields public","Making fields private with getters/setters","Using global variables","Avoiding constructors"], ans: 1 },
        ],
      },
      {
        id: 'patterns', name: 'Design Patterns',
        questions: [
          { q: "Which design pattern ensures only one instance of a class?", opts: ["Factory Pattern","Observer Pattern","Singleton Pattern","Builder Pattern"], ans: 2 },
          { q: "Observer pattern is used for?", opts: ["Object creation","One-to-many dependency / event notification","Database transactions","Sorting algorithms"], ans: 1 },
          { q: "Factory Method pattern is used to?", opts: ["Create one object","Create families of related objects","Define skeleton of an algorithm","Provide an interface for creating objects without specifying their class"], ans: 3 },
          { q: "'Program to an interface, not an implementation' is which principle?", opts: ["Encapsulation","Dependency Inversion","Liskov Substitution","Single Responsibility"], ans: 1 },
          { q: "Decorator pattern is used to?", opts: ["Create objects","Add behavior to objects dynamically","Convert interface to another","Access remote objects"], ans: 1 },
          { q: "Facade pattern?", opts: ["Provides simple interface to complex subsystem","Ensures single instance","Monitors state changes","Separates algorithm from object structure"], ans: 0 },
          { q: "Strategy pattern allows?", opts: ["Creating objects via factory","Switching algorithms at runtime","Composing objects into tree structures","Lazy initialization"], ans: 1 },
          { q: "SOLID stands for?", opts: ["Single, Open, Liskov, Interface, Dependency","Simple, Object, Logic, Interface, Dynamic","Single, Optional, Lazy, Interface, Derived","State, Object, Linked, Interface, Dependency"], ans: 0 },
        ],
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   FULL MOCK TESTS (mix of all topics, 10 min timer)
   ════════════════════════════════════════════════════════════════════════════ */
const FULL_MOCKS = [
  {
    id: 'full-dsa', title: 'DSA Full Mock', emoji: '🧮', color: '#3b82f6',
    desc: 'Arrays, Trees, Sorting, DP — all chapters mixed',
    questions: [
      { q: "Time complexity of accessing an array element by index?", opts: ["O(log n)","O(n)","O(1)","O(n²)"], ans: 2 },
      { q: "Which traversal of BST gives sorted output?", opts: ["Preorder","Postorder","Inorder","Level-order"], ans: 2 },
      { q: "Worst-case time complexity of QuickSort?", opts: ["O(n log n)","O(n)","O(n²)","O(log n)"], ans: 2 },
      { q: "BFS uses which data structure?", opts: ["Stack","Priority Queue","Queue","Heap"], ans: 2 },
      { q: "Kadane's algorithm finds?", opts: ["Minimum subarray","Maximum subarray sum","Longest substring","Shortest path"], ans: 1 },
      { q: "DP requires: overlapping subproblems +?", opts: ["Greedy choice","Optimal substructure","Random sampling","Backtracking"], ans: 1 },
      { q: "Space complexity of MergeSort?", opts: ["O(1)","O(log n)","O(n)","O(n²)"], ans: 2 },
      { q: "Topological sort works on?", opts: ["Undirected graphs","Cyclic graphs","Directed Acyclic Graphs","Complete graphs"], ans: 2 },
      { q: "Coin Change seeks to minimize?", opts: ["Number of coins used","Value of coins","Weight of coins","Number of types"], ans: 0 },
      { q: "Sliding window is mainly used for?", opts: ["2D problems","Subarray/substring problems","Tree traversal","Graph shortest path"], ans: 1 },
    ],
  },
  {
    id: 'full-gate', title: 'GATE CS Full Mock', emoji: '🎓', color: '#ef4444',
    desc: 'OS, DBMS, Networks, TOC — comprehensive GATE prep',
    questions: [
      { q: "Which normal form eliminates partial dependencies?", opts: ["1NF","2NF","3NF","BCNF"], ans: 1 },
      { q: "Which scheduling may cause starvation?", opts: ["Round Robin","FCFS","Priority Scheduling","SJF non-preemptive"], ans: 2 },
      { q: "OSI routing layer?", opts: ["Data Link","Transport","Network","Session"], ans: 2 },
      { q: "NFA can be converted to equivalent?", opts: ["PDA","Turing Machine","DFA","CFG"], ans: 2 },
      { q: "TCP provides?", opts: ["Faster transmission","Connectionless service","Reliable ordered delivery","Broadcast support"], ans: 2 },
      { q: "SQL HAVING clause filters?", opts: ["Rows before grouping","Individual columns","Groups after GROUP BY","Null values"], ans: 2 },
      { q: "Virtual memory allows?", opts: ["Programs larger than RAM to run","Faster CPU","Multiple CPUs","Encrypted memory"], ans: 0 },
      { q: "P = NP — which problem is NP-Complete?", opts: ["Sorting","Binary Search","Boolean SAT","Shortest Path"], ans: 2 },
      { q: "DMA reduces load on?", opts: ["Memory","CPU","I/O Devices","Cache"], ans: 1 },
      { q: "Context-free grammars generate?", opts: ["Regular languages only","Context-free languages","Context-sensitive","Recursively enumerable"], ans: 1 },
    ],
  },
  {
    id: 'full-upsc', title: 'UPSC Prelims Mock', emoji: '🏛️', color: '#f97316',
    desc: 'Polity, History, Geography combined mock',
    questions: [
      { q: "Which Article abolishes untouchability?", opts: ["Article 14","Article 17","Article 21","Article 25"], ans: 1 },
      { q: "Battle of Plassey was fought in?", opts: ["1757","1761","1764","1775"], ans: 0 },
      { q: "Tropic of Cancer passes through how many Indian states?", opts: ["6","7","8","9"], ans: 2 },
      { q: "Parliament consists of?", opts: ["Lok Sabha only","RS + LS","President + RS + LS","PM + President + LS"], ans: 2 },
      { q: "Which river is 'Sorrow of Bihar'?", opts: ["Son","Kosi","Gandak","Ghaghra"], ans: 1 },
      { q: "Right to Education Act passed in?", opts: ["2005","2007","2009","2011"], ans: 2 },
      { q: "Quit India Movement launched in?", opts: ["1940","1942","1944","1945"], ans: 1 },
      { q: "Largest coastline state in India?", opts: ["Maharashtra","Tamil Nadu","Andhra Pradesh","Gujarat"], ans: 3 },
      { q: "ISRO Headquarters located in?", opts: ["Mumbai","Bengaluru","Chennai","Hyderabad"], ans: 1 },
      { q: "Dandi March was to protest?", opts: ["Partition","Salt tax","Press restrictions","Rowlatt Act"], ans: 1 },
    ],
  },
  {
    id: 'full-ssc', title: 'SSC CGL Tier 1 Mock', emoji: '📋', color: '#06b6d4',
    desc: 'Quant, English, Reasoning, GK mixed',
    questions: [
      { q: "Train 200m passes pole in 10 sec. Speed?", opts: ["10 m/s","20 m/s","15 m/s","25 m/s"], ans: 1 },
      { q: "Synonym of 'Benevolent'?", opts: ["Cruel","Malicious","Kind","Fierce"], ans: 2 },
      { q: "Odd one out: Mango, Guava, Papaya, Potato", opts: ["Mango","Guava","Papaya","Potato"], ans: 3 },
      { q: "15% of 240?", opts: ["32","36","40","42"], ans: 1 },
      { q: "Antonym of 'Verbose'?", opts: ["Talkative","Garrulous","Brief","Fluent"], ans: 2 },
      { q: "Books : Library :: Paintings : ?", opts: ["Museum","School","Gallery","Garden"], ans: 2 },
      { q: "A:B = 2:3, B:C = 4:5. A:B:C = ?", opts: ["8:12:15","4:6:5","2:3:5","8:6:15"], ans: 0 },
      { q: "15 men do work in 20 days. 12 days needs?", opts: ["20","22","25","30"], ans: 2 },
      { q: "Correctly spelt?", opts: ["Accomodation","Accommodation","Acommodation","Accommodtion"], ans: 1 },
      { q: "India's first satellite?", opts: ["Bhaskara","Aryabhata","INSAT-1B","Rohini"], ans: 1 },
    ],
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════════════════════════════════════════ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/* ════════════════════════════════════════════════════════════════════════════
   TIMER (always 10 min = 600 sec)
   ════════════════════════════════════════════════════════════════════════════ */
function Timer({ onTimeUp }) {
  const [secs, setSecs] = useState(600);
  const ref = useRef(null);
  useEffect(() => {
    ref.current = setInterval(() => setSecs(p => {
      if (p <= 1) { clearInterval(ref.current); onTimeUp(); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(ref.current);
  }, [onTimeUp]);
  const pct = (secs / 600) * 100;
  const warn = pct < 25;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.4rem 1rem', borderRadius: 99, fontWeight: 800,
      fontSize: '1.1rem', fontFamily: 'monospace',
      background: warn ? 'rgba(239,68,68,0.15)' : 'rgba(255,69,0,0.1)',
      color: warn ? '#f87171' : 'var(--primary)',
      animation: warn ? 'pulse-glow 1.5s infinite' : 'none',
      border: `1px solid ${warn ? 'rgba(239,68,68,0.3)' : 'rgba(255,69,0,0.2)'}`,
    }}>
      <Clock size={18} /> {fmt(secs)}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   QUESTION SCREEN
   ════════════════════════════════════════════════════════════════════════════ */
function QuizScreen({ title, questions, onDone }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const handleTimeUp = useCallback(() => { setTimeUp(true); onDone(score, true); }, [score, onDone]);

  const q = questions[idx];
  const progress = ((idx + (answered ? 1 : 0)) / questions.length) * 100;

  const pick = (i) => {
    if (answered) return;
    setSelected(i); setAnswered(true);
    if (i === q.ans) setScore(p => p + 1);
  };

  const next = () => {
    if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); setAnswered(false); }
    else { const final = answered && selected === q.ans ? score + 1 : score; onDone(answered && selected === q.ans ? score + 1 : score, false); }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.05rem' }}>{title}</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.82rem' }}>Question {idx + 1} of {questions.length}</p>
        </div>
        <Timer onTimeUp={handleTimeUp} />
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, background: 'var(--secondary)', borderRadius: 99, marginBottom: '1.25rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>

      {/* Card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.75rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Q{idx + 1}. {q.q}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
          {q.opts.map((opt, i) => {
            let bg = 'var(--secondary)', border = 'var(--border)', color = 'var(--foreground)';
            if (answered) {
              if (i === q.ans) { bg = 'rgba(34,197,94,0.12)'; border = '#22c55e'; color = '#4ade80'; }
              else if (i === selected) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; color = '#f87171'; }
              else { bg = 'transparent'; color = 'var(--muted-foreground)'; }
            }
            return (
              <button key={i} onClick={() => pick(i)} disabled={answered}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: 10,
                  background: bg, border: `1px solid ${border}`, color,
                  textAlign: 'left', cursor: answered ? 'default' : 'pointer',
                  fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 500,
                  transition: 'all 0.2s',
                  opacity: answered && i !== q.ans && i !== selected ? 0.5 : 1,
                }}>
                <span style={{ fontWeight: 800, color: 'var(--primary)', flexShrink: 0 }}>{['A','B','C','D'][i]}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4ade80', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={15} /> Correct answer: <strong>{q.opts[q.ans]}</strong>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => onDone(score, false)} style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            background: 'var(--secondary)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer',
            color: 'var(--muted-foreground)', fontSize: '0.85rem', fontWeight: 600,
            fontFamily: 'Outfit, sans-serif',
          }}>
            <X size={14} /> Exit
          </button>
          {answered && (
            <button onClick={next} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              {idx < questions.length - 1 ? 'Next' : 'Finish'} <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   RESULT SCREEN
   ════════════════════════════════════════════════════════════════════════════ */
function ResultScreen({ title, score, total, timeUp, onRetry, onBack }) {
  const navigate = useNavigate();
  const pct = total > 0 ? ((score / total) * 100).toFixed(1) : 0;
  const grade = pct >= 80 ? { label: 'Excellent!', color: '#4ade80', emoji: '🏆' }
    : pct >= 60 ? { label: 'Good Job!', color: 'var(--primary)', emoji: '👍' }
    : { label: 'Keep Practicing!', color: '#f87171', emoji: '💪' };

  // save score
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:5001/api/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ subject: title, score, total, accuracy: parseFloat(pct), date: new Date().toLocaleDateString() }),
    }).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '1rem', textAlign: 'center' }} className="animate-slide-up">
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '2.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{grade.emoji}</div>
        {timeUp && <p style={{ color: '#f87171', fontWeight: 700, marginBottom: '0.5rem' }}>⌛ Time's up! Auto-submitted.</p>}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>{title}</h2>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>{grade.label}</p>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: grade.color, lineHeight: 1 }}>
          {score}<span style={{ fontSize: '1.5rem', color: 'var(--muted-foreground)', fontWeight: 400 }}>/{total}</span>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--muted-foreground)', marginTop: '0.5rem', marginBottom: '2rem' }}>
          Accuracy: <strong style={{ color: grade.color }}>{pct}%</strong>
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onBack} className="btn btn-secondary">← Back to Tests</button>
          <button onClick={onRetry} className="btn btn-primary">Retry <Shuffle size={15} /></button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline">Dashboard</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function MockTests() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('chapter');        // 'chapter' | 'full'
  const [selSubject, setSelSubject] = useState(null);
  const [quiz, setQuiz] = useState(null);           // { title, questions }
  const [result, setResult] = useState(null);

  const requireLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login to attempt tests and save your scores.'); navigate('/login'); return false; }
    return true;
  };

  const startChapterTest = (subjectId, chapterId) => {
    if (!requireLogin()) return;
    const sub = SUBJECTS.find(s => s.id === subjectId);
    const ch  = sub.chapters.find(c => c.id === chapterId);
    setQuiz({ title: `${sub.name} — ${ch.name}`, questions: shuffle(ch.questions) });
  };

  const startFullMock = (mock) => {
    if (!requireLogin()) return;
    setQuiz({ title: mock.title, questions: shuffle(mock.questions) });
  };

  const handleDone = (score, timeUp) => {
    setResult({ title: quiz.title, questions: quiz.questions, score, timeUp });
    setQuiz(null);
  };

  // ── Quiz Screen ──
  if (quiz) {
    return (
      <div className="page-wrapper">
        <QuizScreen title={quiz.title} questions={quiz.questions} onDone={handleDone} />
      </div>
    );
  }

  // ── Result Screen ──
  if (result) {
    return (
      <div className="page-wrapper">
        <ResultScreen
          title={result.title}
          score={result.score}
          total={result.questions?.length || 0}
          timeUp={result.timeUp}
          onBack={() => { setResult(null); setSelSubject(null); }}
          onRetry={() => { setQuiz({ title: result.title, questions: shuffle(result.questions) }); setResult(null); }}
        />
      </div>
    );
  }

  // ── Chapter drill-down ──
  if (tab === 'chapter' && selSubject) {
    const sub = SUBJECTS.find(s => s.id === selSubject);
    return (
      <div className="container animate-slide-up">
        <button onClick={() => setSelSubject(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontFamily: 'Outfit,sans-serif', fontWeight: 600, marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> Back to subjects
        </button>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {sub.emoji} {sub.name} — Chapter Tests
        </h2>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
          Each chapter test has 8 questions · ⏱ 10 min timer
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
          {sub.chapters.map(ch => (
            <div key={ch.id} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: sub.color }} />
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{ch.name}</h3>
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.82rem' }}>{ch.questions.length} questions · 10 min</p>
              <button
                onClick={() => startChapterTest(sub.id, ch.id)}
                className="btn btn-primary"
                style={{ background: `linear-gradient(135deg, ${sub.color}, ${sub.color}cc)`, boxShadow: `0 4px 16px ${sub.color}44`, marginTop: 'auto' }}
              >
                <Play fill="currentColor" size={13} /> Start Chapter Test
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Main listing ──
  return (
    <div className="container animate-slide-up">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          🧪 Mock Test System
        </h1>
        <p style={{ color: 'var(--muted-foreground)' }}>
          ⏱ All tests are <strong style={{ color: 'var(--foreground)' }}>10 minutes</strong>. Login required to save scores.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'inline-flex', background: 'var(--secondary)',
        borderRadius: 99, padding: 4, marginBottom: '2rem', gap: 4,
      }}>
        {[{ id: 'chapter', label: '📚 Chapter Tests' }, { id: 'full', label: '📝 Full Mock Tests' }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelSubject(null); }}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 99, border: 'none', cursor: 'pointer',
              background: tab === t.id ? 'var(--primary)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--muted-foreground)',
              fontWeight: 700, fontSize: '0.88rem', fontFamily: 'Outfit,sans-serif',
              boxShadow: tab === t.id ? '0 4px 12px rgba(255,69,0,0.35)' : 'none',
              transition: 'all 0.25s',
            }}>{t.label}
          </button>
        ))}
      </div>

      {/* ── CHAPTER TAB ── */}
      {tab === 'chapter' && (
        <>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            Select a subject to see its chapter-wise tests:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {SUBJECTS.map(sub => (
              <div key={sub.id}
                onClick={() => setSelSubject(sub.id)}
                style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '1.5rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = sub.color + '66'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: sub.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  {sub.emoji}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{sub.name}</h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  {sub.chapters.length} chapters · {sub.chapters.reduce((s, c) => s + c.questions.length, 0)} total questions
                </p>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  color: sub.color, fontSize: '0.83rem', fontWeight: 700,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: 'Outfit,sans-serif',
                }}>View Chapters →</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── FULL MOCKS TAB ── */}
      {tab === 'full' && (
        <>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            Full mock tests mix questions from all chapters — great for exam simulation:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
            {FULL_MOCKS.map(mock => (
              <div key={mock.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: mock.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                    {mock.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700 }}>{mock.title}</h3>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>{mock.desc}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
                  <span><Clock size={13} style={{ display: 'inline', marginRight: 4 }} />10 min</span>
                  <span><List size={13} style={{ display: 'inline', marginRight: 4 }} />{mock.questions.length} questions</span>
                </div>
                <button
                  onClick={() => startFullMock(mock)}
                  className="btn btn-primary"
                  style={{ background: `linear-gradient(135deg, ${mock.color}, ${mock.color}cc)`, boxShadow: `0 4px 16px ${mock.color}44`, marginTop: 'auto' }}
                >
                  <Play fill="currentColor" size={13} /> Start Full Mock
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: '2.5rem', padding: '1rem 1.25rem', background: 'rgba(255,69,0,0.06)', border: '1px solid rgba(255,69,0,0.15)', borderRadius: 12, fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
        💡 <strong style={{ color: 'var(--foreground)' }}>Tip:</strong> Use the AI Tutor chatbot to get explanations for any question after the test! Ask it to explain the correct answer.
      </div>
    </div>
  );
}
