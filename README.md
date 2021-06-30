# Solidity Example - A Simple Calculator Machine

Testing for `delegatecall` vs `call`

## Configuration

### Install Truffle cli

_Skip if you have already installed._

```
npm install -g truffle
```

### Install Dependencies

```
yarn install
```

## Test and Attack!💥

### Run Tests

```
truffle develop
test
```

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: Calculator
    √ should call (828ms)
    √ should delegatecall (734ms)


  2 passing (2s)

```
