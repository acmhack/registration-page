import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Group,
  Loader,
  Space,
  Stack,
  Switch,
  Text,
  Title,
  Flex,
  MediaQuery,
  Container,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { FC, useCallback, useEffect, useState } from 'react';
import { calculateRemainingTime } from "../utils/utils";

interface Applicant {
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatus;
  age: string;
  phoneNumber: string;
  country: string;
  school: string;
  levelOfStudy: string;
  graduationMonth: string;
  graduationYear: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  dietRestrictions: string[];
  hackathonCount: string;
  resume: string | null;
  linkedin?: string;
  github?: string;
  otherSites: string[];
  attendingPrehacks: boolean;
  lookingForTeam: boolean;
  codeOfConductAgreement: boolean;
  dataAgreement: boolean;
  mlhAgreement: boolean;
}

function makeIcon(checked: boolean): CheckboxProps["icon"] {
  const CheckboxIcon: CheckboxProps["icon"] = ({ className }) =>
    checked ? (
      <IconCheck className={className} />
    ) : (
      <IconX className={className} />
    );

  return CheckboxIcon;
}

const Status: FC<{
  applicant: Applicant;
  onConfirm: () => void;
  confirming: boolean;
}> = ({ applicant, onConfirm, confirming }) => {
  return (
    <Stack
      spacing={10}
      p={25}
      justify="center"
      style={{
        backgroundColor: "rgba(20, 134, 72, .2)",
        borderRadius: 15,
      }}
    >
      <Title order={2} inline align="center" color={"#148648"}>
        PickHacks Checklist:
      </Title>
      <Stack spacing={6} ml="lg">
        <Group maw={640} sx={{ justifyContent: "space-between" }}>
          <Group>
            <Checkbox
              readOnly
              checked
              icon={makeIcon(applicant.userStatus !== "Profile Pending")}
              color={
                applicant.userStatus !== "Profile Pending" ? "green" : "red"
              }
            />
            <Text>Profile Completed</Text>
          </Group>
          {applicant.userStatus === "Profile Pending" && (
            <Text weight="bold">
              Complete your application in the{" "}
              <Link href="/application">application tab</Link>
            </Text>
          )}
        </Group>
        <Group>
          <Checkbox
            readOnly
            checked
            icon={makeIcon(
              applicant.userStatus !== "Profile Pending" &&
                applicant.userStatus !== "Admission Pending"
            )}
            color={
              applicant.userStatus !== "Profile Pending" &&
              applicant.userStatus !== "Admission Pending"
                ? "green"
                : "red"
            }
          />
          <Text>Admitted</Text>
        </Group>
        <Group maw={640} sx={{ justifyContent: "space-between" }}>
          <Group>
            <Checkbox
              readOnly
              checked
              icon={makeIcon(
                applicant.userStatus === "Confirmed" ||
                  applicant.userStatus === "Checked In"
              )}
              color={
                applicant.userStatus === "Confirmed" ||
                applicant.userStatus === "Checked In"
                  ? "green"
                  : "red"
              }
            />
            <Text>Confirmed</Text>
          </Group>
          {applicant.userStatus === "Confirmation Pending" && (
            <Group>
              <Button compact loading={confirming} onClick={onConfirm}>
                I will attend!
              </Button>
              <Text weight="bold">
                Confirmation Deadline:{" "}
                {new Date(2023, 3, 9).toLocaleDateString()}
              </Text>
            </Group>
          )}
        </Group>
        <Group>
          <Checkbox
            readOnly
            checked
            icon={makeIcon(applicant.userStatus === "Checked In")}
            color={applicant.userStatus === "Checked In" ? "green" : "red"}
          />
          <Text>Checked In</Text>
        </Group>
      </Stack>
    </Stack>
  );
};

const Dashboard: NextPage = () => {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const [[days, hours, minutes, seconds], setCountdown] = useState<[number, number, number, number]>(calculateRemainingTime());
	const smol = useMediaQuery('screen and (max-width: 1000px)');
	const [applicant, setApplicant] = useState<Applicant | null>(null);
	const [confirming, setConfirming] = useState<boolean>(false);
	const [lft, setLFT] = useState<boolean>(false);
	const [togglingLFT, setTogglingLFT] = useState<boolean>(false);

	const toggleLFT = useCallback(() => {
		setTogglingLFT(true);

		axios
			.post('/api/lft')
			.then(() => {
				setLFT((lft) => !lft);
			})
			.catch((err: AxiosError) => {
				if (err.response) {
					console.log(err.response);
					notifications.show({ message: err.response.data as string, title: 'Something went wrong...', autoClose: 5000, color: 'red' });
				}
			})
			.finally(() => {
				setTogglingLFT(false);
			});
	}, []);

	useEffect(() => {
		if (!user && !isLoading) {
			router.replace('/api/auth/login');
		} else if (!isLoading) {
			axios.get<Applicant>('/api/me').then((res) => {
				setApplicant(res.data);
				setLFT(res.data.lookingForTeam);
			});
		}
	}, [user, router, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateRemainingTime());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!applicant) {
    return (
		<MediaQuery query="(max-width: 1300px)" styles={{ paddingLeft: "100px" }}>
			<Flex
			justify="center"
			align="center"
			direction="column"
			gap={40}
			style={{ height: "100%" }}
			>
				<Title>Loading...</Title>
			</Flex>
		</MediaQuery>
    );
  }

  if (applicant.userStatus === "Denied") {
    return (
      <div>
        <Title color="red">Sorry, your application has been denied.</Title>
      </div>
    );
  }

  return (
    <MediaQuery query="(max-width: 1300px)" styles={{ paddingLeft: "100px" }}>
      <Flex
        justify="center"
        align="center"
        direction="column"
        gap={40}
        style={{ height: "100%" }}
      >
        <MediaQuery
          query="(max-width: 1100px)"
          styles={{ flexDirection: "column" }}
        >
          <Flex mt={20}>
            <Title inline align="center">
              Welcome,&nbsp;
            </Title>
            <Title inline align="center">
              {applicant.firstName} {applicant.lastName}!
            </Title>
          </Flex>
        </MediaQuery>
        <Status
          applicant={applicant}
          onConfirm={() => {
            axios
              .post("/api/confirm")
              .then((res) => {
                setConfirming(false);
                setApplicant(res.data);
              })
              .catch((err: AxiosError) => {
                if (err.response) {
                  console.log(err.response);
                  notifications.show({
                    message: err.response.data as string,
                    title: "Something went wrong...",
                    autoClose: 5000,
                    color: "red",
                  });
                }

                setConfirming(false);
              });
            setConfirming(true);
          }}
          confirming={confirming}
        />
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap={10}
          px={25}
          py={20}
          style={{
            backgroundColor: "rgba(20, 134, 72, .2)",
            borderRadius: 15,
          }}
        >
          <Title order={2} align="center" inline color={"#148648"}>
            Team Status
          </Title>
          <Group position="center" noWrap>
            <Switch disabled={togglingLFT} onChange={toggleLFT} checked={lft}/>
            {lft ? (
              <Text inline style={{ whiteSpace: "nowrap" }}>
                Looking for a team
              </Text>
            ) : (
              <Text inline>Not looking for a team</Text>
            )}
            {togglingLFT && <Loader size="sm" />}
          </Group>
        </Flex>
        {applicant.attendingPrehacks && (
          <Title order={4}>Prehacks Date: April 6th</Title>
        )}
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap={10}
          px={25}
          py={20}
          style={{
            backgroundColor: "rgba(20, 134, 72, .2)",
            borderRadius: 15,
          }}
        >
          <Title order={2} align="center" color={"#148648"} inline>
            PickHacks Date:
          </Title>
          <Title order={2} align="center" inline>
            April 14th-16th
          </Title>
        </Flex>
        {!smol ? (
          <Group
            spacing={0}
            align="center"
            position="center"
            px={25}
            py={20}
            style={{
              backgroundColor: "rgba(20, 134, 72, .2)",
              borderRadius: 15,
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Title order={2} mr={16} inline style={{ color: "#148648" }}>
              PickHacks Countdown:
            </Title>
            <Flex>
              <Title size={36}>{days}</Title>
              <Title order={2} style={{ alignSelf: "flex-end" }}>
                d
              </Title>
              <Title size={36} mx={8}>
                :
              </Title>
              <Title size={36}>{hours < 10 ? "0" + hours : hours}</Title>
              <Title order={2} style={{ alignSelf: "flex-end" }}>
                h
              </Title>
              <Title size={36} mx={8}>
                :
              </Title>
              <Title size={36}>{minutes < 10 ? "0" + minutes : minutes}</Title>
              <Title order={2} style={{ alignSelf: "flex-end" }}>
                m
              </Title>
              <Title size={36} mx={8}>
                :
              </Title>
              <Title size={36}>{seconds < 10 ? "0" + seconds : seconds}</Title>
              <Title order={2} style={{ alignSelf: "flex-end" }}>
                s
              </Title>
            </Flex>
          </Group>
        ) : (
          <Group
            spacing={0}
            align="center"
            position="center"
            p={20}
            style={{
              backgroundColor: "rgba(20, 134, 72, .2)",
              borderRadius: 15,
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Title order={2} align="center" inline style={{ color: "#148648" }}>
              PickHacks Countdown:{" "}
            </Title>
            <div style={{ display: "flex" }}>
              <Title>{days}</Title>
              <Title size="sm" mb={5} style={{ alignSelf: "flex-end" }}>
                d
              </Title>
              <Title mx={5}>:</Title>
              <Title>{hours}</Title>
              <Title size="sm" mb={5} style={{ alignSelf: "flex-end" }}>
                h
              </Title>
              <Title mx={5}>:</Title>
              <Title>{minutes}</Title>
              <Title size="sm" mb={5} style={{ alignSelf: "flex-end" }}>
                m
              </Title>
              <Title mx={5}>:</Title>
              <Title>{seconds}</Title>
              <Title size="sm" mb={5} style={{ alignSelf: "flex-end" }}>
                s
              </Title>
            </div>
          </Group>
        )}
      </Flex>
    </MediaQuery>
  );
};

export default withPageAuthRequired(Dashboard, { returnTo: "/dashboard" });
