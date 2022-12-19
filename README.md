# Node File Manager

## Start CLI

**Point of entry**:

```npm run start -- --username=your_username```

### Commands

**Navigation**:

1. ```up``` - *go upper from current directory* 
2. ```cd dir_path``` - *go to the specified folder (if path is file - Operation failed)*
3. ```ls``` - *print in console list of all files and folders in current directory*

**File system**:

1. ```cat path_to_file``` - *read file and print it's content in console*
2. ```add new_file_name``` - *create empty file in current working directory*
3. ```rn path_to_file new_filename``` - *rename file*
4. ```cp path_to_file path_to_new_directory``` - *copy file*
5. ```mv path_to_file path_to_new_directory``` - *move file*
6. ```rm path_to_file``` - *delete file*

**Operating system**:

1. ```os --EOL``` - *get EOL (default system End-Of-Line)*
2. ```os --cpus``` - *get host machine CPUs info*
3. ```os --homedir``` - *get home directory*
4. ```os --username``` - *get current system user name*
5. ```os --architecture``` - *get CPU architecture*

**Hash**:

1. ```hash path_to_file``` - *calculate hash for file*

**Zip**:

1. ```compress path_to_file path_to_destination``` - *compress file* (path_to_destination - folder path)
2. ```decompress path_to_file path_to_destination``` - *decompress file* (path_to_destination - folder path)