import React, { useState } from 'react';
import { Search, ExternalLink, ChevronLeft, BookOpen, X } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   DATA — Subjects → Chapters → Resources
   ════════════════════════════════════════════════════════════════════════════ */
const SUBJECTS = [
  {
    id: 'dsa', emoji: '🧮', name: 'DSA', color: '#3b82f6',
    desc: 'Data Structures & Algorithms — from arrays to graphs',
    chapters: [
      {
        id: 'arrays', name: 'Arrays & Strings', emoji: '📊',
        desc: 'Two pointers, sliding window, prefix sum, hashing',
        docs: [
          { title: 'GFG Arrays Tutorial',               type: 'Article', url: 'https://www.geeksforgeeks.org/array-data-structure/' },
          { title: 'Sliding Window Technique — GFG',    type: 'Article', url: 'https://www.geeksforgeeks.org/window-sliding-technique/' },
          { title: 'Two Pointer Approach',               type: 'Article', url: 'https://www.geeksforgeeks.org/two-pointers-technique/' },
          { title: 'LeetCode — Array Problems',         type: 'Practice',url: 'https://leetcode.com/tag/array/' },
          { title: 'Abdul Bari — Arrays (YouTube)',     type: 'Video',   url: 'https://www.youtube.com/watch?v=AT14lCXuMKI' },
        ],
      },
      {
        id: 'linked', name: 'Linked Lists', emoji: '🔗',
        desc: 'Singly, doubly, circular, fast & slow pointers',
        docs: [
          { title: 'GFG Linked List Guide',             type: 'Article', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/' },
          { title: "Striver's Linked List Sheet",       type: 'Sheet',   url: 'https://takeuforward.org/linked-list/striver-linked-list-series/' },
          { title: 'LeetCode Linked List Problems',     type: 'Practice',url: 'https://leetcode.com/tag/linked-list/' },
          { title: 'CS50 — Linked Lists',               type: 'Video',   url: 'https://www.youtube.com/watch?v=zQI3FyWm144' },
        ],
      },
      {
        id: 'trees', name: 'Trees & Graphs', emoji: '🌳',
        desc: 'BST, AVL, Heaps, BFS, DFS, Dijkstra, Union-Find',
        docs: [
          { title: 'GFG Binary Tree Guide',             type: 'Article', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/' },
          { title: 'GFG Graph Algorithms',              type: 'Article', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/' },
          { title: 'Visualgo — Tree Visualization',     type: 'Visual',  url: 'https://visualgo.net/en/bst' },
          { title: "Striver's Tree Sheet",              type: 'Sheet',   url: 'https://takeuforward.org/data-structure/striver-tree-series/' },
          { title: 'CP Algorithms — Graphs',            type: 'Docs',    url: 'https://cp-algorithms.com/graph/breadth-first-search.html' },
        ],
      },
      {
        id: 'dp', name: 'Dynamic Programming', emoji: '💡',
        desc: 'Memoization, tabulation, Knapsack, LCS, LIS',
        docs: [
          { title: 'GFG DP Tutorial',                   type: 'Article', url: 'https://www.geeksforgeeks.org/dynamic-programming/' },
          { title: "Striver's DP Series (YouTube)",     type: 'Video',   url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY' },
          { title: 'Atcoder DP Contest (Free practice)',type: 'Practice',url: 'https://atcoder.jp/contests/dp' },
          { title: 'DP Patterns — LeetCode Discuss',    type: 'Article', url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns' },
        ],
      },
      {
        id: 'sorting', name: 'Sorting & Searching', emoji: '🔢',
        desc: 'QuickSort, MergeSort, HeapSort, Binary Search',
        docs: [
          { title: 'Sorting Algorithms Visualized',     type: 'Visual',  url: 'https://visualgo.net/en/sorting' },
          { title: 'GFG Sorting Algorithms',            type: 'Article', url: 'https://www.geeksforgeeks.org/sorting-algorithms/' },
          { title: 'Binary Search — GFG',               type: 'Article', url: 'https://www.geeksforgeeks.org/binary-search/' },
          { title: 'NeetCode — Binary Search Playlist', type: 'Video',   url: 'https://www.youtube.com/playlist?list=PLot-Xpze53le' },
        ],
      },
    ],
  },
  {
    id: 'web', emoji: '🌐', name: 'Web Development', color: '#22c55e',
    desc: 'Frontend + Backend + Databases — Full Stack',
    chapters: [
      {
        id: 'html-css', name: 'HTML & CSS', emoji: '🎨',
        desc: 'Semantic HTML, Flexbox, Grid, Animations, Responsive Design',
        docs: [
          { title: 'MDN HTML Reference',                type: 'Docs',    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
          { title: 'MDN CSS Reference',                 type: 'Docs',    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
          { title: 'CSS Flexbox Guide — CSS Tricks',    type: 'Article', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
          { title: 'CSS Grid Guide — CSS Tricks',       type: 'Article', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' },
          { title: 'freeCodeCamp HTML+CSS Course',      type: 'Course',  url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
        ],
      },
      {
        id: 'js', name: 'JavaScript', emoji: '⚡',
        desc: 'ES6+, async/await, closures, prototypes, DOM',
        docs: [
          { title: 'JavaScript.info (Best JS Guide)',   type: 'Article', url: 'https://javascript.info/' },
          { title: 'MDN JavaScript Reference',          type: 'Docs',    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
          { title: 'freeCodeCamp JS Algorithms',        type: 'Course',  url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' },
          { title: 'You Don\'t Know JS (Free Book)',    type: 'Book',    url: 'https://github.com/getify/You-Dont-Know-JS' },
        ],
      },
      {
        id: 'react', name: 'React & Next.js', emoji: '⚛️',
        desc: 'Hooks, Context, React Router, Next.js, SSR',
        docs: [
          { title: 'React Official Docs',               type: 'Docs',    url: 'https://react.dev/' },
          { title: 'Next.js Official Docs',             type: 'Docs',    url: 'https://nextjs.org/docs' },
          { title: 'Scrimba — Learn React (Free)',      type: 'Course',  url: 'https://scrimba.com/learn/learnreact' },
          { title: 'Full React Course — FCC YouTube',  type: 'Video',   url: 'https://www.youtube.com/watch?v=4UZrsTqkcW4' },
        ],
      },
      {
        id: 'backend', name: 'Node.js & Express', emoji: '🖥️',
        desc: 'REST APIs, Middleware, Authentication, MongoDB',
        docs: [
          { title: 'Node.js Official Docs',             type: 'Docs',    url: 'https://nodejs.org/en/docs/' },
          { title: 'Express.js Guide',                  type: 'Docs',    url: 'https://expressjs.com/en/guide/routing.html' },
          { title: 'MongoDB University (Free)',          type: 'Course',  url: 'https://learn.mongodb.com/' },
          { title: 'The Odin Project — Node.js',        type: 'Course',  url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs' },
        ],
      },
    ],
  },
  {
    id: 'gate', emoji: '🎓', name: 'GATE CS', color: '#ef4444',
    desc: 'OS, DBMS, Networks, TOC, Algorithms, Digital Logic',
    chapters: [
      {
        id: 'os', name: 'Operating Systems', emoji: '💻',
        desc: 'Scheduling, Deadlock, Memory Management, File Systems',
        docs: [
          { title: 'NPTEL OS Lectures (IIT Kharagpur)', type: 'Video',   url: 'https://nptel.ac.in/courses/106/105/106105082/' },
          { title: 'GFG OS Notes',                      type: 'Article', url: 'https://www.geeksforgeeks.org/operating-systems/' },
          { title: 'GATE Overflow — OS Questions',      type: 'PYQ',     url: 'https://gateoverflow.in/tag/operating-system' },
          { title: 'Neso Academy OS (YouTube)',         type: 'Video',   url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O' },
        ],
      },
      {
        id: 'dbms', name: 'DBMS', emoji: '🗄️',
        desc: 'SQL, Normalization, Transactions, B-Trees, Indexing',
        docs: [
          { title: 'GFG DBMS Tutorial',                 type: 'Article', url: 'https://www.geeksforgeeks.org/dbms/' },
          { title: 'GATE Overflow — DBMS Questions',    type: 'PYQ',     url: 'https://gateoverflow.in/tag/databases' },
          { title: 'NPTEL DBMS Lectures',               type: 'Video',   url: 'https://nptel.ac.in/courses/106/105/106105175/' },
          { title: 'SQLZoo — Interactive SQL',          type: 'Practice',url: 'https://sqlzoo.net/' },
        ],
      },
      {
        id: 'networks', name: 'Computer Networks', emoji: '🌐',
        desc: 'OSI Layers, TCP/IP, Routing, HTTP, DNS, Security',
        docs: [
          { title: 'NPTEL Computer Networks (IIT)',     type: 'Video',   url: 'https://nptel.ac.in/courses/106/105/106105081/' },
          { title: 'GFG Computer Networks',             type: 'Article', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' },
          { title: 'GATE Overflow — Networks',          type: 'PYQ',     url: 'https://gateoverflow.in/tag/computer-networks' },
          { title: 'Neso Academy Networks (YouTube)',   type: 'Video',   url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx' },
        ],
      },
      {
        id: 'toc', name: 'Theory of Computation', emoji: '🔄',
        desc: 'DFA, NFA, CFG, PDA, Turing Machines, Complexity',
        docs: [
          { title: 'GFG TOC Tutorial',                  type: 'Article', url: 'https://www.geeksforgeeks.org/theory-of-computation-automata-tutorials/' },
          { title: 'Neso Academy TOC (YouTube)',        type: 'Video',   url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOIev' },
          { title: 'GATE Overflow — TOC Questions',     type: 'PYQ',     url: 'https://gateoverflow.in/tag/theory-of-computation' },
        ],
      },
      {
        id: 'algo', name: 'Algorithms', emoji: '🧮',
        desc: 'Divide & Conquer, Greedy, DP, Graph algorithms',
        docs: [
          { title: 'CP Algorithms Reference',           type: 'Docs',    url: 'https://cp-algorithms.com/' },
          { title: 'MIT 6.006 Algorithms (Free)',       type: 'Course',  url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/' },
          { title: 'Abdul Bari Algorithms (YouTube)',   type: 'Video',   url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O' },
          { title: 'GATE Overflow — Algorithms',        type: 'PYQ',     url: 'https://gateoverflow.in/tag/algorithms' },
        ],
      },
    ],
  },
  {
    id: 'upsc', emoji: '🏛️', name: 'UPSC / PCS', color: '#f97316',
    desc: 'History, Polity, Economy, Geography, Current Affairs',
    chapters: [
      {
        id: 'polity', name: 'Indian Polity', emoji: '⚖️',
        desc: 'Constitution, Fundamental Rights, Parliament, Judiciary',
        docs: [
          { title: "Laxmikanth Polity Notes (Summary)", type: 'Article', url: 'https://www.pwonlyias.com/upsc-notes/laxmikanth-polity-notes/' },
          { title: 'NCERT Political Science (Free)',     type: 'Book',    url: 'https://ncert.nic.in/textbook.php?khss2=0-9' },
          { title: 'GovtPolity PDF Notes',              type: 'Article', url: 'https://www.insightsonindia.com/polity/' },
          { title: 'Vision IAS Polity Notes',           type: 'Article', url: 'https://www.visionias.in/resources/study-material/' },
        ],
      },
      {
        id: 'history', name: 'Modern History', emoji: '📜',
        desc: 'Freedom struggle, British policies, Revolts, National Movement',
        docs: [
          { title: 'NCERT History Books (Free)',         type: 'Book',    url: 'https://ncert.nic.in/textbook.php?fhis2=0-8' },
          { title: 'Spectrum Modern History Summary',   type: 'Article', url: 'https://www.insightsonindia.com/modern-indian-history/' },
          { title: 'InsightsIAS History Notes',         type: 'Article', url: 'https://www.insightsonindia.com/2023/02/27/modern-history-notes/' },
          { title: 'UPSC Modern History PYQs',          type: 'PYQ',     url: 'https://www.insightsonindia.com/2022/04/22/upsc-previous-year-question-papers/' },
        ],
      },
      {
        id: 'geography', name: 'Geography', emoji: '🌏',
        desc: 'Indian & World Geography, Climate, Rivers, Minerals',
        docs: [
          { title: 'NCERT Geography Books (Free)',       type: 'Book',    url: 'https://ncert.nic.in/textbook.php?fgeo2=0-6' },
          { title: 'InsightsIAS Geography Notes',       type: 'Article', url: 'https://www.insightsonindia.com/indian-geography/' },
          { title: 'Vision IAS Geography Material',     type: 'Article', url: 'https://www.visionias.in/resources/' },
          { title: 'Mrunal Geography Lectures',         type: 'Video',   url: 'https://mrunal.org/geography' },
        ],
      },
      {
        id: 'economy', name: 'Indian Economy', emoji: '💰',
        desc: 'GDP, Budget, Monetary Policy, Banking, Trade',
        docs: [
          { title: 'Mrunal Economy Notes (Free)',        type: 'Article', url: 'https://mrunal.org/economy' },
          { title: 'NCERT Economics (Free)',             type: 'Book',    url: 'https://ncert.nic.in/textbook.php?leco1=0-9' },
          { title: 'Economic Survey — Budget Portal',   type: 'Docs',    url: 'https://www.indiabudget.gov.in/economicsurvey/' },
          { title: 'InsightsIAS Economy Notes',         type: 'Article', url: 'https://www.insightsonindia.com/indian-economy/' },
        ],
      },
    ],
  },
  {
    id: 'ssc', emoji: '📋', name: 'SSC Preparation', color: '#06b6d4',
    desc: 'Quant, Reasoning, GK, English — CGL, CHSL, MTS',
    chapters: [
      {
        id: 'quant', name: 'Quantitative Aptitude', emoji: '📐',
        desc: 'Number system, Profit-Loss, Time-Work, Geometry',
        docs: [
          { title: 'Rakesh Yadav Maths Notes (PDF)',    type: 'Book',    url: 'https://www.adda247.com/product-rakeshyadavssc' },
          { title: 'Testbook SSC Quant Practice',       type: 'Practice',url: 'https://testbook.com/ssc-cgl/quantitative-aptitude' },
          { title: 'Study IQ Maths Tricks (YouTube)',   type: 'Video',   url: 'https://www.youtube.com/c/StudyIQEducation' },
          { title: 'GFG Quant Aptitude',                type: 'Article', url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/' },
        ],
      },
      {
        id: 'english', name: 'English Language', emoji: '📝',
        desc: 'Grammar, Vocabulary, Comprehension, Error Spotting',
        docs: [
          { title: 'Plinth to Paramount English (Summary)', type: 'Article', url: 'https://www.adda247.com/product-plinth-paramount' },
          { title: 'Testbook English Grammar Notes',    type: 'Article', url: 'https://testbook.com/english-grammar' },
          { title: 'BBC Learning English (Free)',        type: 'Course',  url: 'https://www.bbc.co.uk/learningenglish/' },
          { title: 'SSC English Practice — Adda247',   type: 'Practice',url: 'https://www.adda247.com/ssc-jobs/ssc-cgl-english/' },
        ],
      },
      {
        id: 'reasoning', name: 'Logical Reasoning', emoji: '🧠',
        desc: 'Series, Analogy, Puzzles, Coding-Decoding, Blood Relations',
        docs: [
          { title: 'GFG Logical Reasoning',             type: 'Article', url: 'https://www.geeksforgeeks.org/logical-reasoning/' },
          { title: 'Testbook Reasoning Practice',       type: 'Practice',url: 'https://testbook.com/ssc-cgl/reasoning' },
          { title: 'SSC Reasoning Tricks (YouTube)',    type: 'Video',   url: 'https://www.youtube.com/c/StudyIQEducation' },
          { title: 'IndiaBix Reasoning',                type: 'Practice',url: 'https://www.indiabix.com/logical-reasoning/questions-and-answers/' },
        ],
      },
    ],
  },
  {
    id: 'oops', emoji: '🏗️', name: 'OOPs & Design Patterns', color: '#a855f7',
    desc: 'Core Java, C++, SOLID Principles, Design Patterns',
    chapters: [
      {
        id: 'java', name: 'Java OOP', emoji: '☕',
        desc: 'Classes, Inheritance, Polymorphism, Abstraction, Interfaces',
        docs: [
          { title: 'GFG OOP in Java',                   type: 'Article', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/' },
          { title: 'Java OOP — Jenkov Tutorials',       type: 'Article', url: 'https://jenkov.com/tutorials/java-oop/index.html' },
          { title: 'Java OOP Course — Coursera (Audit)',type: 'Course',  url: 'https://www.coursera.org/learn/object-oriented-java' },
          { title: 'Java Programming MOOC (Free)',      type: 'Course',  url: 'https://java-programming.mooc.fi/' },
        ],
      },
      {
        id: 'cpp', name: 'C++ OOP', emoji: '⚙️',
        desc: 'RAII, Virtual functions, Templates, STL, Smart Pointers',
        docs: [
          { title: 'LearnCPP.com (Best C++ Guide)',     type: 'Article', url: 'https://www.learncpp.com/' },
          { title: 'GFG C++ OOP Concepts',              type: 'Article', url: 'https://www.geeksforgeeks.org/c-plus-plus/' },
          { title: 'CPP Reference (Docs)',               type: 'Docs',    url: 'https://en.cppreference.com/' },
        ],
      },
      {
        id: 'patterns', name: 'Design Patterns', emoji: '🎨',
        desc: 'Creational, Structural, Behavioral — Singleton, Factory, Observer',
        docs: [
          { title: 'Refactoring.Guru (Best Patterns Resource)', type: 'Book', url: 'https://refactoring.guru/design-patterns' },
          { title: 'GFG Design Patterns',               type: 'Article', url: 'https://www.geeksforgeeks.org/software-design-patterns/' },
          { title: 'SOLID Principles Explained',        type: 'Article', url: 'https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design' },
        ],
      },
    ],
  },
  {
    id: 'jee', emoji: '⚛️', name: 'JEE Mains', color: '#eab308',
    desc: 'Physics, Chemistry, Mathematics — Mains & Advanced',
    chapters: [
      {
        id: 'maths', name: 'Mathematics', emoji: '📐',
        desc: 'Calculus, Algebra, Coordinate Geometry, Vectors',
        docs: [
          { title: 'NCERT Maths Books (Free)',           type: 'Book',    url: 'https://ncert.nic.in/textbook.php?kemh1=0-16' },
          { title: 'JEE Maths by PW (YouTube)',         type: 'Video',   url: 'https://www.youtube.com/c/PhysicsWallah' },
          { title: 'Khan Academy Maths',                 type: 'Course',  url: 'https://www.khanacademy.org/math' },
          { title: 'JEE Maths PYQ — Vedantu',          type: 'PYQ',     url: 'https://www.vedantu.com/iit-jee/jee-main-previous-year-papers' },
        ],
      },
      {
        id: 'physics', name: 'Physics', emoji: '🔭',
        desc: 'Mechanics, Thermodynamics, Electrostatics, Modern Physics',
        docs: [
          { title: 'NCERT Physics Books (Free)',         type: 'Book',    url: 'https://ncert.nic.in/textbook.php?keph1=0-15' },
          { title: 'Physics Wallah JEE Physics (YouTube)', type: 'Video', url: 'https://www.youtube.com/c/PhysicsWallah' },
          { title: 'Khan Academy Physics',               type: 'Course',  url: 'https://www.khanacademy.org/science/physics' },
        ],
      },
      {
        id: 'chemistry', name: 'Chemistry', emoji: '🧪',
        desc: 'Organic, Inorganic, Physical Chemistry',
        docs: [
          { title: 'NCERT Chemistry Books (Free)',       type: 'Book',    url: 'https://ncert.nic.in/textbook.php?kech1=0-14' },
          { title: 'PW Chemistry JEE (YouTube)',         type: 'Video',   url: 'https://www.youtube.com/c/PhysicsWallah' },
          { title: 'Khan Academy Chemistry',             type: 'Course',  url: 'https://www.khanacademy.org/science/chemistry' },
        ],
      },
    ],
  },
  {
    id: 'neet', emoji: '🔬', name: 'NEET', color: '#ec4899',
    desc: 'Biology, Physics, Chemistry',
    chapters: [
      {
        id: 'biology', name: 'Biology', emoji: '🧬',
        desc: 'Cell Biology, Genetics, Human Physiology, Ecology',
        docs: [
          { title: 'NCERT Biology Class 11 (Free)',     type: 'Book',    url: 'https://ncert.nic.in/textbook.php?kebo1=0-22' },
          { title: 'NCERT Biology Class 12 (Free)',     type: 'Book',    url: 'https://ncert.nic.in/textbook.php?lebo1=0-16' },
          { title: 'Vedantu NEET Biology (YouTube)',    type: 'Video',   url: 'https://www.youtube.com/c/VedantuNEET' },
          { title: 'PW Biology NEET (YouTube)',         type: 'Video',   url: 'https://www.youtube.com/c/PhysicsWallah' },
          { title: 'Khan Academy Biology',              type: 'Course',  url: 'https://www.khanacademy.org/science/biology' },
        ],
      },
      {
        id: 'neet-physics', name: 'Physics (NEET)', emoji: '⚡',
        desc: 'Mechanics, Optics, Modern Physics for NEET',
        docs: [
          { title: 'NCERT Physics (Free)',               type: 'Book',    url: 'https://ncert.nic.in/textbook.php?keph1=0-15' },
          { title: 'PW NEET Physics (YouTube)',          type: 'Video',   url: 'https://www.youtube.com/c/PhysicsWallah' },
          { title: 'Khan Academy Physics',               type: 'Course',  url: 'https://www.khanacademy.org/science/physics' },
        ],
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   TYPE BADGE COLORS
   ════════════════════════════════════════════════════════════════════════════ */
const TYPE_COLORS = {
  Article:  { bg: 'rgba(59,130,246,0.12)',  text: '#60a5fa' },
  Video:    { bg: 'rgba(239,68,68,0.12)',   text: '#f87171' },
  Course:   { bg: 'rgba(34,197,94,0.12)',   text: '#4ade80' },
  Book:     { bg: 'rgba(234,179,8,0.12)',   text: '#facc15' },
  Docs:     { bg: 'rgba(168,85,247,0.12)', text: '#c084fc' },
  Practice: { bg: 'rgba(249,115,22,0.12)', text: '#fb923c' },
  PYQ:      { bg: 'rgba(236,72,153,0.12)', text: '#f472b6' },
  Sheet:    { bg: 'rgba(6,182,212,0.12)',   text: '#22d3ee' },
  Visual:   { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24' },
};

/* ════════════════════════════════════════════════════════════════════════════
   RESOURCE MODAL
   ════════════════════════════════════════════════════════════════════════════ */
function ResourceModal({ chapter, subColor, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 18, width: '100%', maxWidth: 580,
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px ${subColor}22`,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: subColor + '0d',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{chapter.emoji}</span>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>{chapter.name}</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>{chapter.docs.length} free resources</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--muted-foreground)',
          }}>
            <X size={14} />
          </button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {chapter.docs.map((doc, i) => {
            const ts = TYPE_COLORS[doc.type] || TYPE_COLORS.Article;
            return (
              <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  padding: '0.9rem 1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', padding: '0.18rem 0.5rem', borderRadius: 5, background: ts.bg, color: ts.text, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {doc.type.toUpperCase()}
                </span>
                <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500 }}>{doc.title}</span>
                <ExternalLink size={13} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CHAPTER LIST (level 2)
   ════════════════════════════════════════════════════════════════════════════ */
function ChapterList({ subject, onBack }) {
  const [openChapter, setOpenChapter] = useState(null);
  const ch = subject.chapters.find(c => c.id === openChapter);

  return (
    <div>
      {ch && <ResourceModal chapter={ch} subColor={subject.color} onClose={() => setOpenChapter(null)} />}

      {/* Back */}
      <button onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--muted-foreground)', fontFamily: 'Outfit,sans-serif',
        fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem',
      }}>
        <ChevronLeft size={16} /> All Subjects
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          {subject.emoji} {subject.name}
        </h2>
        <p style={{ color: 'var(--muted-foreground)' }}>{subject.desc}</p>
      </div>

      {/* Chapter cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {subject.chapters.map(ch => (
          <div
            key={ch.id}
            onClick={() => setOpenChapter(ch.id)}
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '1.25rem', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '0.6rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = subject.color + '55';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 10px 28px rgba(0,0,0,0.4)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '1.75rem' }}>{ch.emoji}</div>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ch.name}</h3>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.78rem', lineHeight: 1.5 }}>{ch.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>{ch.docs.length} resources</span>
              <button style={{ color: subject.color, fontSize: '0.8rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
                Open →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function StudyMaterials() {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const filtered = SUBJECTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  );

  const subject = SUBJECTS.find(s => s.id === selectedSubject);

  if (subject) {
    return (
      <div className="container animate-slide-up" style={{ paddingTop: '1rem' }}>
        <ChapterList subject={subject} onBack={() => setSelectedSubject(null)} />
      </div>
    );
  }

  return (
    <div className="container animate-slide-up" style={{ paddingTop: '1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          📚 Study Materials & Notes
        </h1>
        <p style={{ color: 'var(--muted-foreground)', maxWidth: 560 }}>
          Chapter-wise free resources — official docs, video lectures, PYQs and books.
          Click a subject → pick a chapter → open resources.
        </p>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 460, marginBottom: '2.5rem', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none' }} />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search subjects, e.g. 'DSA', 'UPSC', 'React'..."
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)', borderRadius: 99,
            padding: '0.65rem 1rem 0.65rem 2.75rem', color: 'var(--foreground)',
            fontSize: '0.9rem', outline: 'none', fontFamily: 'Outfit,sans-serif',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,69,0,0.5)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Subject Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        {filtered.map(sub => (
          <div key={sub.id} onClick={() => setSelectedSubject(sub.id)}
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '1.25rem', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = sub.color + '55';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.5)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: sub.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              {sub.emoji}
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>{sub.name}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{sub.desc}</p>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>
                {sub.chapters.length} chapters
              </span>
              <button style={{ color: sub.color, fontSize: '0.82rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'gap 0.2s' }}>
                Open →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '3rem' }}>
          No subjects found. Try a different keyword.
        </p>
      )}

      {/* Tip banner */}
      <div style={{ marginTop: '3rem', padding: '1rem 1.25rem', background: 'rgba(255,69,0,0.06)', border: '1px solid rgba(255,69,0,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
          All resources are <strong style={{ color: 'var(--foreground)' }}>completely free</strong>. Each link opens official docs, free courses, or curated notes in a new tab.
        </p>
      </div>
    </div>
  );
}
