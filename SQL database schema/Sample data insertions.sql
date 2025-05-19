-- INSERT Statements for Categories
INSERT INTO
    Categories (CategoryName)
VALUES
    ('Fiction');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Science Fiction');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Fantasy');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Mystery');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Thriller');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Romance');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Historical Fiction');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Non-Fiction');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Biography');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('History');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Science');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Classic Literature');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Poetry');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Drama');

INSERT INTO
    Categories (CategoryName)
VALUES
    ('Children''s Literature');

-- INSERT Statements for Authors
INSERT INTO
    Authors (AuthorName)
VALUES
    ('A.S. Byatt');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Alan Moore');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Albert Camus');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Aldous Huxley');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Alexandre Dumas');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Alice Walker');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Anne Frank');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Anthony Burgess');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Anthony Powell');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Antoine de Saint-Exupéry');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Anton Chekhov');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Arthur Conan Doyle');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Bernard Malamud');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Bram Stoker');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('C.S. Lewis');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Carson McCullers');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Charles Dickens');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Charlotte Brontë');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Chinua Achebe');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Christina Stead');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Christopher Isherwood');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Cormac McCarthy');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Daniel Defoe');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Dante Alighieri');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Daphne du Maurier');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Dashiell Hammett');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('David Foster Wallace');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Don DeLillo');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Doris Lessing');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Doris May Lessing');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('E. B. White');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('E. M. Forster');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('E.L. Doctorow');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('E.M. Forster');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Edgar Allan Poe');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Edith Wharton');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Elizabeth Bowen');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Emily Brontë');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Erich Maria Remarque');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Ernest Hemingway');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Evelyn Waugh');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('F. Scott Fitzgerald');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Flann O''Brien');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Ford Madox Ford');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Frank Herbert');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Franz Kafka');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Fyodor Dostoevsky');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Gabriel García Márquez');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('George Eliot');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('George Orwell');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Giuseppe Tomasi di Lampedusa');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Graham Greene');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Gustave Flaubert');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Günter Grass');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Harper Lee');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Henry David Thoreau');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Henry Green');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Henry James');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Henry Miller');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Henry Roth');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Herman Melville');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Homer');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Ian McEwan');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Iris Murdoch');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('J. D. Salinger');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('J. R. R. Tolkien');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('J.D. Salinger');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('J.R.R. Tolkien');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('Jack Kerouac');

INSERT INTO
    Authors (AuthorName)
VALUES
    ('James Agee');

-- INSERT Statements for Books
INSERT INTO
    Books (
        BookName,
        AuthorID,
        PublishYear,
        Quantity,
        CategoryID
    )
VALUES
    ('The Crying of Lot 49', 50, 1966, 10, 11),
    ('Native Son', 64, 1940, 1, 15),
    ('The Golden Notebook', 30, 1962, 3, 1),
    ('Midnight''s Children', 26, 1981, 14, 8),
    ('Crime and Punishment', 47, 1866, 12, 11),
    (
        'A Portrait of the Artist as a Young Man',
        39,
        1916,
        6,
        9
    ),
    ('Treasure Island', 61, 1883, 15, 13),
    ('Beloved', 1, 1987, 15, 9),
    ('Gone With the Wind', 42, 1936, 15, 14),
    ('The Count of Monte Cristo', 5, 1844, 12, 4),
    ('Snow Crash', 5, 1874, 12, 9),
    ('Charlotte''s Web', 31, 1952, 3, 6),
    ('David Copperfield', 17, 1849, 0, 14),
    ('Dead Souls', 62, 1842, 5, 14),
    ('Invisible Man', 6, 1952, 9, 8),
    ('Leaves of Grass', 68, 1855, 14, 11),
    ('The Iliad', 62, -750, 12, 13),
    ('Revolutionary Road', 1, 1816, 5, 7),
    ('Mrs. Dalloway', 69, 1925, 12, 10),
    ('Death Comes for the Archbishop', 12, 1891, 2, 12),
    ('Money', 26, 1815, 6, 2),
    ('Their Eyes Were Watching God', 19, 1937, 9, 10),
    ('A Handful of Dust', 41, 1847, 3, 8),
    ('One Flew Over the Cuckoo’s Nest', 9, 1868, 6, 7),
    ('The Stranger', 3, 1942, 13, 3),
    ('The Sun Also Rises', 40, 1926, 11, 5),
    ('The Hound of the Baskervilles', 12, 1902, 15, 10),
    ('A Death in the Family', 70, 1933, 15, 11),
    ('All the King''s Men', 4, 1814, 4, 1),
    ('Ubik', 35, 1870, 3, 12);

INSERT INTO
    Books (
        BookName,
        AuthorID,
        PublishYear,
        Quantity,
        CategoryID
    )
VALUES
    ('Demons', 47, 1872, 1, 15),
    ('Slaughterhouse-Five', 33, 1969, 1, 3),
    ('The Age of Innocence', 36, 1920, 6, 7),
    ('The Heart Is a Lonely Hunter', 16, 1822, 9, 5),
    ('Red Harvest', 26, 1834, 15, 1),
    ('The Sound and the Fury', 20, 1929, 8, 15),
    ('To Kill a Mockingbird', 55, 1960, 4, 5),
    ('Little Women', 39, 1868, 3, 9),
    ('The Tin Drum', 54, 1959, 9, 10),
    ('The Death of the Heart', 37, 1915, 0, 14),
    ('The Heart of the Matter', 52, 2020, 0, 15),
    ('Nineteen Eighty Four', 50, 1949, 10, 14),
    (
        'Alice''s Adventures in Wonderland',
        49,
        1865,
        13,
        2
    ),
    ('Absalom, Absalom!', 65, 1936, 11, 11),
    ('The Confessions of Nat Turner', 61, 1838, 13, 1),
    ('The Corrections', 48, 2015, 8, 11),
    ('The Sheltering Sky', 45, 1905, 8, 3),
    ('Dracula', 14, 1897, 5, 11),
    ('In Cold Blood', 20, 1966, 11, 11),
    ('The Recognitions', 10, 1915, 14, 13),
    ('Herzog', 24, 1987, 14, 9),
    ('Loving', 57, 1991, 0, 11),
    ('Gone with the Wind', 31, 1845, 0, 12),
    ('1984', 50, 1852, 15, 13),
    ('The Long Goodbye', 3, 1953, 10, 11),
    ('The Sot-Weed Factor', 19, 1907, 14, 5),
    ('The Bell Jar', 69, 1963, 10, 6),
    ('Deliverance', 7, 1961, 12, 9),
    ('Essays', 59, 1580, 9, 2),
    ('The Picture of Dorian Gray', 20, 1890, 0, 11);

INSERT INTO
    Books (
        BookName,
        AuthorID,
        PublishYear,
        Quantity,
        CategoryID
    )
VALUES
    ('The Idiot', 47, 1869, 0, 4),
    ('The Castle', 46, 1926, 7, 4),
    ('Moby-Dick', 61, 1851, 10, 5),
    ('Brave New World', 4, 1932, 13, 15),
    ('Ragtime', 33, 1806, 6, 14),
    (
        'The Complete Tales and Poems of Edgar Allan Poe',
        35,
        1902,
        10,
        5
    ),
    ('Vanity Fair', 3, 1847, 14, 8),
    ('The Metamorphosis', 46, 1915, 14, 1),
    ('The Diary of a Young Girl', 7, 1947, 10, 14),
    ('Journey to the End of The Night', 52, 1932, 7, 2),
    ('I, Claudius', 50, 1996, 4, 3),
    (
        'The Lion, the Witch and the Wardrobe',
        15,
        1881,
        5,
        15
    ),
    ('The Bridge of San Luis Rey', 57, 1922, 0, 14),
    ('White Teeth', 29, 1861, 11, 7),
    ('Dune', 45, 1965, 5, 13),
    ('Possession', 1, 1874, 11, 3),
    ('One Hundred Years of Solitude', 48, 1967, 9, 12),
    ('Waiting for Godot', 20, 1953, 13, 12),
    ('The Prime of Miss Jean Brodie', 64, 1863, 0, 4),
    ('Faust', 62, 1808, 5, 5),
    ('Things Fall Apart', 19, 1958, 0, 1),
    ('Call It Sleep', 60, 1878, 0, 8),
    ('Appointment in Samarra', 19, 1971, 0, 15),
    ('Bleak House', 17, 1852, 1, 4),
    ('The Trial', 46, 1925, 0, 13),
    ('The Grapes of Wrath', 65, 1939, 9, 6),
    ('The Divine Comedy', 24, 1308, 5, 5),
    ('The Man Without Qualities', 70, 1930, 15, 14),
    (
        'The Spy Who Came In from the Cold',
        24,
        1819,
        9,
        4
    ),
    ('Catch-22', 20, 1961, 0, 5);

INSERT INTO
    Books (
        BookName,
        AuthorID,
        PublishYear,
        Quantity,
        CategoryID
    )
VALUES
    ('Emma', 39, 1815, 10, 6),
    ('The Stories of Anton Chekhov', 11, 1900, 14, 11),
    ('Jane Eyre', 18, 1847, 14, 10),
    ('Hamlet', 4, 1600, 3, 2),
    ('Brideshead Revisited', 41, 1945, 4, 12),
    ('The Big Sleep', 53, 1939, 10, 11),
    ('Lord of the Flies', 35, 1954, 8, 10),
    ('A House for Mr Biswas', 59, 1914, 0, 11),
    ('The Odyssey', 62, -740, 14, 13),
    ('Go Tell It on the Mountain', 43, 1986, 14, 7),
    ('Don Quixote', 8, 1605, 0, 11),
    ('Under the Net', 64, 1852, 14, 3),
    ('Watchmen', 2, 1970, 15, 2),
    ('Portnoy’s Complaint', 1, 1873, 0, 13),
    ('The Scarlet Letter', 56, 1850, 0, 13),
    ('Middlemarch', 49, 1871, 15, 4),
    ('The Power and the Glory', 52, 1943, 9, 9),
    ('Tropic of Cancer', 59, 1806, 0, 11),
    ('Heart of Darkness', 12, 1899, 14, 13),
    ('An American Tragedy', 38, 1854, 2, 8),
    ('To the Lighthouse', 50, 1927, 5, 2),
    (
        'A Dance to the Music of Time: 1st Movement',
        9,
        2013,
        11,
        11
    ),
    ('Housekeeping', 47, 1955, 5, 7),
    ('Gulliver''s Travels', 36, 1726, 4, 6),
    ('The Portrait of a Lady', 58, 1881, 0, 12),
    ('In Search of Lost Time', 37, 1913, 7, 13),
    ('Madame Bovary', 53, 1857, 0, 4),
    ('Rebecca', 25, 1938, 13, 3),
    ('Animal Farm', 50, 1945, 11, 8),
    ('Pride and Prejudice', 11, 1813, 12, 8);

INSERT INTO
    Books (
        BookName,
        AuthorID,
        PublishYear,
        Quantity,
        CategoryID
    )
VALUES
    ('The Master and Margarita', 43, 1967, 5, 11),
    ('The French Lieutenant’s Woman', 61, 1913, 0, 6),
    ('Midnight’s Children', 17, 1821, 9, 2),
    ('Atonement', 63, 1992, 14, 13),
    ('Adventures of Huckleberry Finn', 57, 1884, 6, 10),
    ('The Aeneid', 41, 19, 15, 11),
    ('Never Let Me Go', 37, 1972, 15, 11),
    ('The Little Prince', 10, 1943, 12, 1),
    ('The Good Soldier', 44, 1915, 12, 13),
    ('Lolita', 7, 1955, 15, 5),
    ('Fictions', 9, 1944, 8, 12),
    ('Les Misérables', 3, 1862, 9, 9),
    ('Falconer', 2, 1943, 7, 1),
    ('Anna Karenina', 16, 1877, 11, 5),
    ('A Clockwork Orange', 8, 1857, 5, 13),
    ('A Passage to India', 32, 1924, 6, 13),
    ('All Quiet on the Western Front', 39, 1928, 0, 5),
    ('Walden', 56, 1854, 14, 3),
    ('At Swim-Two-Birds', 52, 1879, 13, 9),
    (
        'Are You There God? It’s Me, Margaret',
        25,
        1892,
        13,
        10
    ),
    ('The Handmaid''s Tale', 18, 1985, 10, 5),
    (
        'The Life And Opinions Of Tristram Shandy',
        10,
        1759,
        10,
        12
    ),
    ('Ulysses', 62, 1922, 1, 8),
    ('The Day of the Locust', 66, 1994, 7, 3),
    ('The Magic Mountain', 51, 1924, 10, 11),
    (
        'Blood Meridian, or, the Evening Redness in the West',
        22,
        1937,
        0,
        3
    ),
    ('Candide', 64, 1759, 12, 14),
    ('Naked Lunch: The Restored Text', 55, 1878, 10, 2),
    ('War and Peace', 65, 1869, 14, 11),
    ('The Blind Assassin', 40, 1837, 9, 4);

-- INSERT Statements for Readers
INSERT INTO
    Readers (ReaderName, Address, PhoneNumber)
VALUES
    (
        'Ngô Khoa',
        '701 High St, District Ninh Kieu, Hanoi',
        '0377194001'
    ),
    (
        'Phan Vy An',
        '493 Elm St, District 1, Hai Phong',
        '0914248267'
    ),
    (
        'Bùi Quân Thảo',
        '853 Pine St, District 1, Ho Chi Minh City',
        '0717872866'
    ),
    (
        'Hoàng  Quỳnh',
        '723 Main St, District Ngo Quyen, Can Tho',
        '0874784019'
    ),
    (
        'Nguyễn Nam An',
        '915 Hill St, District Ninh Kieu, Ho Chi Minh City',
        '0379416084'
    ),
    (
        'Dương Huy',
        '183 Washington St, District 1, Da Nang',
        '0924040619'
    ),
    (
        'Lê Phúc',
        '348 Elm St, District Ba Dinh, Hai Phong',
        '0320918027'
    ),
    (
        'Nguyễn Quân',
        '163 Elm St, District Ninh Kieu, Ho Chi Minh City',
        '0952528166'
    ),
    (
        'Đặng Hương Minh',
        '340 Hill St, District Ngo Quyen, Da Nang',
        '0887453130'
    ),
    (
        'Bùi Linh',
        '670 Oak St, District Ba Dinh, Da Nang',
        '0982959572'
    ),
    (
        'Nguyễn Phúc Long',
        '607 Washington St, District Hai Chau, Can Tho',
        '0946157741'
    ),
    (
        'Phạm Mai',
        '359 Hill St, District Ngo Quyen, Da Nang',
        '0533634936'
    ),
    (
        'Huỳnh An Nam',
        '716 High St, District 1, Hai Phong',
        '0756608946'
    ),
    (
        'Nguyễn Anh Mai',
        '19 High St, District Ba Dinh, Ho Chi Minh City',
        '0539571944'
    ),
    (
        'Ngô Phúc Anh',
        '885 Lake St, District 1, Hai Phong',
        '0335981673'
    ),
    (
        'Đỗ An',
        '836 Elm St, District 1, Ho Chi Minh City',
        '0597650108'
    ),
    (
        'Lê Anh Trang',
        '39 Maple Ave, District Ngo Quyen, Hai Phong',
        '0524718058'
    ),
    (
        'Huỳnh Minh Trang',
        '338 Lake St, District 1, Hanoi',
        '0970475005'
    ),
    (
        'Đặng Vy Tuấn',
        '928 Lake St, District Ba Dinh, Da Nang',
        '0734073455'
    ),
    (
        'Dương Hương Hương',
        '376 Elm St, District Ninh Kieu, Hanoi',
        '0819457320'
    ),
    (
        'Hồ Khang',
        '262 Elm St, District Ba Dinh, Da Nang',
        '0370519794'
    ),
    (
        'Lê Nam',
        '251 Elm St, District Ngo Quyen, Hanoi',
        '0845965928'
    ),
    (
        'Huỳnh Huy Quỳnh',
        '392 Pine St, District Hai Chau, Hanoi',
        '0782035258'
    ),
    (
        'Vũ Vy Phúc',
        '399 Hill St, District Ninh Kieu, Hanoi',
        '0560949973'
    ),
    (
        'Hoàng Ngọc Anh',
        '249 Oak St, District 1, Ho Chi Minh City',
        '0743241708'
    ),
    (
        'Hồ Vy',
        '309 Main St, District Ninh Kieu, Da Nang',
        '0752313070'
    ),
    (
        'Nguyễn Huy Long',
        '248 Lake St, District Ninh Kieu, Can Tho',
        '0539928217'
    ),
    (
        'Lê Linh',
        '250 Main St, District 1, Hai Phong',
        '0747945869'
    ),
    (
        'Dương Long Thảo',
        '714 Hill St, District Ngo Quyen, Can Tho',
        '0776023605'
    ),
    (
        'Vũ Mai Tuấn',
        '303 Oak St, District Ngo Quyen, Hanoi',
        '0746061435'
    );

INSERT INTO
    Readers (ReaderName, Address, PhoneNumber)
VALUES
    (
        'Đặng Vy',
        '732 Pine St, District 1, Da Nang',
        '0896464053'
    ),
    (
        'Võ Trang Hương',
        '746 Oak St, District Ba Dinh, Can Tho',
        '0740077613'
    ),
    (
        'Đặng Mai Phúc',
        '206 High St, District Ngo Quyen, Ho Chi Minh City',
        '0980398018'
    ),
    (
        'Bùi Khang Khoa',
        '409 Park Ave, District Ninh Kieu, Hai Phong',
        '0932867334'
    ),
    (
        'Phan Khoa Quỳnh',
        '862 Park Ave, District Ngo Quyen, Hai Phong',
        '0810889746'
    ),
    (
        'Võ Quân Khoa',
        '692 Main St, District 1, Da Nang',
        '0813072624'
    ),
    (
        'Võ Khoa',
        '307 Hill St, District Ninh Kieu, Hai Phong',
        '0596137850'
    ),
    (
        'Hồ Quân Tuấn',
        '60 Pine St, District Ngo Quyen, Da Nang',
        '0352687717'
    ),
    (
        'Phạm An',
        '50 Pine St, District Ba Dinh, Hanoi',
        '0511070776'
    ),
    (
        'Phạm Anh',
        '447 Lake St, District Ninh Kieu, Hanoi',
        '0570748930'
    ),
    (
        'Huỳnh Khang Vy',
        '357 High St, District Ngo Quyen, Ho Chi Minh City',
        '0754030635'
    ),
    (
        'William Alexander',
        '461 Elm St, Sydney, UK',
        '+559905130'
    ),
    (
        'Daniel Hughes',
        '344 Park Ave, Mumbai, France',
        '+323846009'
    ),
    (
        'Ashley Collins',
        '180 High St, Berlin, Italy',
        '+19641940009'
    ),
    (
        'Carolyn Green',
        '466 High St, Kyoto, UK',
        '+29371182007'
    ),
    (
        'Stephen Brown',
        '230 Maple Ave, Toronto, Germany',
        '+6846611465'
    ),
    (
        'Jessica Jackson',
        '20 Oak St, Kyoto, Canada',
        '+7039187742'
    ),
    (
        'Emily Allen',
        '14 Hill St, Paris, USA',
        '+1874101334'
    ),
    (
        'John Turner',
        '239 Washington St, Paris, USA',
        '+532494426046'
    ),
    (
        'Linda Bennett',
        '482 Pine St, Sydney, UK',
        '+1029151166'
    ),
    (
        'Jennifer Bennett',
        '714 High St, Rome, India',
        '+672513366693'
    ),
    (
        'Alexander Evans',
        '336 Elm St, Berlin, India',
        '+975560259789'
    ),
    (
        'Donna Diaz',
        '335 Elm St, Rome, USA',
        '+6537447369'
    ),
    (
        'Samuel Henderson',
        '412 Washington St, Kyoto, Italy',
        '+648715422497'
    ),
    (
        'Barbara Long',
        '632 Main St, Berlin, Canada',
        '+657409592604'
    ),
    (
        'Brian Davis',
        '891 Main St, Paris, UK',
        '+922485042'
    ),
    (
        'Jerry Collins',
        '571 Maple Ave, London, Germany',
        '+81233054429'
    ),
    (
        'Ronald Adams',
        '999 Maple Ave, Berlin, Japan',
        '+13373543119'
    ),
    (
        'Kenneth Carter',
        '741 Washington St, Sydney, Germany',
        '+64499672104'
    ),
    (
        'Laura Wood',
        '619 High St, Berlin, Japan',
        '+6976151469'
    );

INSERT INTO
    Readers (ReaderName, Address, PhoneNumber)
VALUES
    (
        'Ronald Green',
        '197 High St, Rome, India',
        '+834614063464'
    ),
    (
        'Helen Russell',
        '76 Washington St, Rome, France',
        '+64140825870'
    ),
    (
        'Amanda Bailey',
        '748 Park Ave, Berlin, France',
        '+767249879019'
    ),
    (
        'Donna Taylor',
        '438 Park Ave, Berlin, India',
        '+93208462527'
    ),
    (
        'Jacob Torres',
        '561 Main St, Paris, Germany',
        '+7752059048'
    ),
    (
        'Daniel Wood',
        '404 Main St, Rome, Japan',
        '+1441683923'
    ),
    (
        'Steven Watson',
        '536 Maple Ave, Berlin, UK',
        '+34727205860'
    ),
    (
        'Scott Young',
        '115 High St, Paris, Italy',
        '+5759598199'
    ),
    (
        'Janet Nelson',
        '59 Lake St, Kyoto, Germany',
        '+318527015606'
    ),
    (
        'Donald Cox',
        '746 Oak St, Rome, France',
        '+93241271771'
    );

-- INSERT Statements for Borrowing
INSERT INTO
    Borrowing (ReaderID, BookID, BorrowDate, ReturnDate)
VALUES
    (31, 38, '2025-04-25', '2025-05-03'),
    (51, 56, '2025-04-13', '2025-04-18'),
    (10, 142, '2025-04-14', '2025-04-23'),
    (64, 28, '2025-04-21', '2025-05-15'),
    (67, 118, '2025-04-26', '2025-04-30'),
    (14, 51, '2025-04-15', '2025-05-01'),
    (19, 40, '2025-05-17', '2025-05-17'),
    (40, 38, '2025-04-17', '2025-05-11'),
    (38, 148, '2025-04-07', '2025-04-09'),
    (66, 39, '2025-04-29', '2025-04-30'),
    (45, 139, '2025-04-22', '2025-05-03'),
    (20, 67, '2025-05-01', '2025-05-05'),
    (6, 78, '2025-05-07', '2025-05-09'),
    (9, 1, '2025-05-15', '2025-05-16'),
    (38, 27, '2025-04-05', '2025-04-10'),
    (21, 89, '2025-04-14', '2025-04-21'),
    (19, 42, '2025-04-20', '2025-04-28'),
    (10, 31, '2025-04-09', '2025-04-15'),
    (8, 36, '2025-04-17', '2025-04-28'),
    (35, 42, '2025-04-23', '2025-05-05'),
    (13, 84, '2025-04-27', '2025-05-08'),
    (4, 110, '2025-04-24', '2025-05-06'),
    (17, 126, '2025-04-03', '2025-04-13'),
    (45, 149, '2025-04-05', '2025-04-23'),
    (21, 31, '2025-04-06', '2025-04-20'),
    (7, 42, '2025-04-11', '2025-04-22'),
    (67, 116, '2025-04-30', '2025-05-08'),
    (65, 147, '2025-05-11', '2025-05-13'),
    (41, 146, '2025-04-17', '2025-04-23'),
    (12, 3, '2025-04-29', '2025-05-08');

INSERT INTO
    Borrowing (ReaderID, BookID, BorrowDate, ReturnDate)
VALUES
    (60, 115, '2025-04-05', '2025-04-18'),
    (65, 76, '2025-04-29', '2025-05-14'),
    (10, 28, '2025-04-19', '2025-04-21'),
    (27, 11, '2025-05-09', '2025-05-10'),
    (53, 138, '2025-04-13', '2025-04-17'),
    (56, 82, '2025-05-17', '2025-05-17'),
    (14, 17, '2025-05-14', '2025-05-15'),
    (48, 136, '2025-05-11', '2025-05-13'),
    (53, 47, '2025-04-10', '2025-05-02'),
    (54, 52, '2025-05-17', '2025-05-17'),
    (2, 27, '2025-04-22', '2025-05-17'),
    (11, 127, '2025-04-07', '2025-04-08'),
    (44, 129, '2025-04-30', '2025-05-01'),
    (49, 107, '2025-04-27', '2025-05-04'),
    (34, 69, '2025-04-26', '2025-04-29'),
    (37, 129, '2025-04-13', '2025-04-22'),
    (37, 11, '2025-04-20', '2025-05-09'),
    (23, 18, '2025-04-27', '2025-05-12'),
    (28, 101, '2025-04-08', '2025-04-18'),
    (38, 97, '2025-04-04', '2025-04-13'),
    (6, 40, '2025-04-30', '2025-05-13'),
    (51, 83, '2025-04-17', '2025-04-28'),
    (41, 24, '2025-05-17', '2025-05-17'),
    (35, 6, '2025-04-10', '2025-04-21'),
    (4, 63, '2025-05-11', '2025-05-12'),
    (56, 44, '2025-04-09', '2025-04-11'),
    (28, 91, '2025-04-20', '2025-04-26'),
    (33, 132, '2025-05-09', '2025-05-12'),
    (50, 48, '2025-04-04', '2025-05-01'),
    (9, 128, '2025-04-16', '2025-05-05');

INSERT INTO
    Borrowing (ReaderID, BookID, BorrowDate, ReturnDate)
VALUES
    (15, 30, '2025-04-26', '2025-04-27'),
    (21, 42, '2025-04-04', '2025-04-14'),
    (63, 146, '2025-05-09', '2025-05-12'),
    (4, 58, '2025-04-02', '2025-04-07'),
    (40, 139, '2025-04-13', '2025-05-09'),
    (62, 98, '2025-04-08', '2025-04-16'),
    (46, 128, '2025-04-19', '2025-04-20'),
    (50, 70, '2025-04-03', '2025-04-07'),
    (3, 84, '2025-04-14', '2025-05-09'),
    (2, 123, '2025-04-20', '2025-05-01'),
    (3, 41, '2025-04-14', '2025-04-26'),
    (35, 108, '2025-04-11', '2025-04-17'),
    (42, 88, '2025-04-02', '2025-04-03'),
    (8, 18, '2025-05-14', '2025-05-15'),
    (67, 108, '2025-04-06', '2025-04-17'),
    (54, 49, '2025-04-25', '2025-05-06'),
    (63, 84, '2025-04-18', '2025-04-21'),
    (31, 94, '2025-05-13', '2025-05-17'),
    (32, 133, '2025-05-06', '2025-05-12'),
    (68, 122, '2025-04-27', '2025-05-11'),
    (10, 62, '2025-04-22', '2025-04-27'),
    (35, 104, '2025-04-07', '2025-04-17'),
    (52, 16, '2025-04-26', '2025-05-08'),
    (31, 32, '2025-04-10', '2025-04-18'),
    (36, 149, '2025-04-19', '2025-04-25'),
    (22, 91, '2025-05-10', '2025-05-13'),
    (8, 123, '2025-04-14', '2025-04-30'),
    (43, 16, '2025-04-07', '2025-04-17'),
    (34, 91, '2025-04-04', '2025-04-05'),
    (25, 136, '2025-04-07', '2025-04-13');

INSERT INTO
    Borrowing (ReaderID, BookID, BorrowDate, ReturnDate)
VALUES
    (39, 127, '2025-04-17', '2025-05-08'),
    (6, 105, '2025-05-14', '2025-05-17'),
    (69, 130, '2025-04-26', '2025-05-06'),
    (28, 99, '2025-05-07', '2025-05-16'),
    (42, 127, '2025-05-10', NULL),
    (65, 142, '2025-04-11', NULL),
    (21, 58, '2025-04-07', NULL),
    (31, 27, '2025-04-01', NULL),
    (48, 42, '2025-05-16', NULL),
    (14, 98, '2025-04-04', NULL),
    (29, 9, '2025-04-19', NULL),
    (40, 121, '2025-04-16', NULL),
    (46, 18, '2025-04-11', NULL),
    (5, 26, '2025-05-11', NULL),
    (4, 87, '2025-04-30', NULL),
    (23, 80, '2025-04-24', NULL),
    (16, 12, '2025-05-01', NULL),
    (53, 133, '2025-05-12', NULL),
    (54, 35, '2025-04-12', NULL),
    (17, 111, '2025-04-08', NULL),
    (4, 128, '2025-04-01', NULL),
    (19, 32, '2025-05-16', NULL),
    (57, 52, '2025-05-02', NULL),
    (17, 31, '2025-04-15', NULL),
    (52, 10, '2025-04-26', NULL),
    (62, 122, '2025-04-22', NULL),
    (51, 61, '2025-04-15', NULL),
    (61, 9, '2025-04-18', NULL),
    (20, 24, '2025-04-10', NULL),
    (11, 69, '2025-04-29', NULL);

INSERT INTO
    Borrowing (ReaderID, BookID, BorrowDate, ReturnDate)
VALUES
    (60, 146, '2025-04-03', NULL),
    (38, 82, '2025-04-03', NULL),
    (55, 146, '2025-04-20', NULL),
    (6, 69, '2025-04-15', NULL),
    (5, 69, '2025-04-14', NULL),
    (24, 145, '2025-05-08', NULL),
    (41, 8, '2025-04-20', NULL),
    (33, 37, '2025-04-07', NULL),
    (61, 140, '2025-04-10', NULL),
    (62, 76, '2025-05-04', NULL),
    (17, 92, '2025-04-08', NULL),
    (14, 4, '2025-05-13', NULL),
    (25, 115, '2025-04-11', NULL),
    (21, 28, '2025-04-22', NULL),
    (56, 133, '2025-05-06', NULL),
    (33, 113, '2025-05-10', NULL),
    (49, 38, '2025-04-15', NULL),
    (43, 65, '2025-05-17', NULL),
    (64, 67, '2025-05-17', NULL),
    (22, 52, '2025-05-05', NULL),
    (1, 100, '2025-04-26', NULL),
    (32, 148, '2025-04-13', NULL),
    (63, 92, '2025-04-19', NULL),
    (18, 4, '2025-04-02', NULL),
    (44, 89, '2025-04-29', NULL),
    (31, 55, '2025-04-06', NULL),
    (68, 141, '2025-04-03', NULL),
    (23, 124, '2025-04-08', NULL),
    (22, 31, '2025-04-27', NULL),
    (47, 127, '2025-04-24', NULL);
